import { transitionWithFeedback } from './feedback';
import {
	PasskeyClient,
	passkeyError,
	type PasskeyRegistrationExchange,
	type PasskeyAuthenticationExchange
} from './passkey-client';
import { BASE_API_URL, PASSKEY_MFA_DEMO_COOKIE } from '#lib/demo/constants.js';
import type { ExposedStateTransition, LoginState } from './common';
import {
	MfaFlow,
	type MfaAuthenticatedState,
	type MfaAuthenticationState,
	type MfaTransitionName
} from './mfa-flow';

export interface PasskeyLoginState extends LoginState {
	loginWithPasskey: ExposedStateTransition;
	startPasskeyAutofill: (signal: AbortSignal) => Promise<void>;
}

export interface PasskeyAuthenticatedState extends MfaAuthenticatedState {
	passkeyEnabled: boolean;
	registerPasskey: ExposedStateTransition;
}

type AuthenticationState =
	| Exclude<MfaAuthenticationState, LoginState | MfaAuthenticatedState>
	| PasskeyLoginState
	| PasskeyAuthenticatedState;
type TransitionName = MfaTransitionName | 'registerPasskey' | 'loginWithPasskey';
const BACKEND_BASE_URL = `${BASE_API_URL}/passkey-mfa`;

export class PasskeyMfaAuthenticationStateManager {
	private readonly passkey = new PasskeyClient(`${BACKEND_BASE_URL}/passkey`);
	private readonly mfa = new MfaFlow(
		(name) => this.runTransition(name),
		BACKEND_BASE_URL,
		PASSKEY_MFA_DEMO_COOKIE
	);
	public currentState: AuthenticationState = $state(this.mfa.buildInitialState());
	public lastRegistration: PasskeyRegistrationExchange | undefined = $state();
	public lastAuthentication: PasskeyAuthenticationExchange | undefined = $state();

	private async addPasskeyActions(state: MfaAuthenticationState): Promise<AuthenticationState> {
		if (state.kind === 'user-login')
			return {
				...state,
				loginWithPasskey: () => this.runTransition('loginWithPasskey'),
				startPasskeyAutofill: (signal) => this.startPasskeyAutofill(signal)
			};
		if (state.kind === 'authenticated') {
			const response = await fetch(`${BACKEND_BASE_URL}/passkey/status`);
			const { passkeyEnabled }: { passkeyEnabled: boolean } = await this.readResponse(response);
			return {
				...state,
				passkeyEnabled,
				registerPasskey: () => this.runTransition('registerPasskey')
			};
		}
		return state;
	}

	private async readResponse<T>(response: Response): Promise<T> {
		const body = await response.json();
		if (!response.ok) throw new Error(body.message ?? response.statusText);
		return body;
	}

	private async registerPasskey(
		state: PasskeyAuthenticatedState
	): Promise<PasskeyAuthenticatedState> {
		try {
			this.lastRegistration = await this.passkey.register();
			return {
				...state,
				passkeyEnabled: true
			};
		} catch (cause) {
			return { ...state, message: passkeyError(cause), messageKind: 'error' };
		}
	}

	private async startPasskeyAutofill(signal: AbortSignal): Promise<void> {
		const state = this.currentState;
		try {
			const result = await this.passkey.autofill(signal);
			if (!result || signal.aborted || this.currentState !== state) return;
			const authenticated = await this.addPasskeyActions(
				await this.mfa.loadAuthenticatedState(result.user)
			);
			if (!signal.aborted && this.currentState === state) {
				this.lastAuthentication = result.exchange;
				this.currentState = authenticated;
			}
		} catch (cause) {
			if (
				signal.aborted ||
				(cause instanceof Error &&
					(cause.name === 'NotAllowedError' || cause.name === 'AbortError'))
			)
				return;
			console.error('Conditional passkey authentication failed:', cause);
			if (this.currentState === state && state.kind === 'user-login') {
				state.message = passkeyError(cause);
				state.messageKind = 'error';
			}
		}
	}

	private async loginWithPasskey(state: PasskeyLoginState): Promise<AuthenticationState> {
		try {
			const { user, exchange } = await this.passkey.login(state.username);
			const authenticated = await this.addPasskeyActions(
				await this.mfa.loadAuthenticatedState(user)
			);
			this.lastAuthentication = exchange;
			return authenticated;
		} catch (cause) {
			return { ...state, password: '', message: passkeyError(cause), messageKind: 'error' };
		}
	}

	private async runTransition(name: TransitionName): Promise<void> {
		this.currentState = await transitionWithFeedback(this.currentState, name, async () => {
			switch (name) {
				case 'registerPasskey':
					if (this.currentState.kind !== 'authenticated')
						throw new Error('Log in before creating a passkey.');
					return await this.registerPasskey(this.currentState);
				case 'loginWithPasskey':
					if (this.currentState.kind !== 'user-login')
						throw new Error('Passkey login requires the login state.');
					return await this.loginWithPasskey(this.currentState);
				default:
					return await this.addPasskeyActions(
						await this.mfa.runTransition(name, this.currentState)
					);
			}
		});
	}
}
