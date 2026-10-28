import { transitionWithFeedback } from './feedback';
import { dev } from '$app/env';
import { BASE_API_URL, DEMO_UNAVAILABLE, PASSKEY_ONLY_DEMO_COOKIE } from '#lib/demo/constants.js';
import { authenticateUsingCookie } from '#lib/demo/helpers.js';
import type { User } from '#lib/demo/models.js';
import type {
	AuthenticatedState,
	DemoUnavailableState,
	ExposedStateTransition,
	InitialState,
	State
} from './common';
import { PasskeyClient, passkeyError } from './passkey-client';

export interface PasskeyOnlyLoginState extends State {
	kind: 'user-login';
	username: string;
	startPasskeyAutofill: (signal: AbortSignal) => Promise<void>;
	message?: string;
	login: ExposedStateTransition;
	toRegistration: ExposedStateTransition;
}

export interface PasskeyOnlyRegistrationState extends State, User {
	kind: 'user-registration';
	message?: string;
	register: ExposedStateTransition;
	toLogin: ExposedStateTransition;
}

type AuthenticationState =
	| DemoUnavailableState
	| InitialState
	| PasskeyOnlyLoginState
	| PasskeyOnlyRegistrationState
	| AuthenticatedState;
type TransitionName = 'initialize' | 'login' | 'logout' | 'register' | 'toLogin' | 'toRegistration';
const BACKEND_BASE_URL = `${BASE_API_URL}/passkey-only`;

export class PasskeyOnlyAuthenticationStateManager {
	private readonly passkey = new PasskeyClient(BACKEND_BASE_URL);
	public currentState: AuthenticationState = $state(this.buildInitialState());

	private buildInitialState(): InitialState {
		return { kind: 'initial', initialize: () => this.runTransition('initialize') };
	}

	private buildLoginState(message?: string, username = ''): PasskeyOnlyLoginState {
		return {
			kind: 'user-login',
			username,
			startPasskeyAutofill: (signal) => this.startPasskeyAutofill(signal),
			message,
			login: () => this.runTransition('login'),
			toRegistration: () => this.runTransition('toRegistration')
		};
	}

	private buildRegistrationState(): PasskeyOnlyRegistrationState {
		return {
			kind: 'user-registration',
			username: '',
			firstname: '',
			lastname: '',
			register: () => this.runTransition('register'),
			toLogin: () => this.runTransition('toLogin')
		};
	}

	private buildAuthenticatedState(user: User): AuthenticatedState {
		return { kind: 'authenticated', user, logout: () => this.runTransition('logout') };
	}

	private async initialize(): Promise<
		DemoUnavailableState | PasskeyOnlyLoginState | AuthenticatedState
	> {
		if (!dev) return DEMO_UNAVAILABLE;
		const authentication = await authenticateUsingCookie(PASSKEY_ONLY_DEMO_COOKIE);
		return authentication.state === 'authenticated'
			? this.buildAuthenticatedState(authentication.user)
			: this.buildLoginState();
	}

	private async startPasskeyAutofill(signal: AbortSignal): Promise<void> {
		const state = this.currentState;
		try {
			const result = await this.passkey.autofill(signal);
			if (!result || signal.aborted || this.currentState !== state) return;
			this.currentState = this.buildAuthenticatedState(result.user);
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

	private async login(
		state: PasskeyOnlyLoginState
	): Promise<PasskeyOnlyLoginState | AuthenticatedState> {
		try {
			const { user } = await this.passkey.login(state.username);
			return this.buildAuthenticatedState(user);
		} catch (cause) {
			return { ...state, message: passkeyError(cause), messageKind: 'error' };
		}
	}

	private async register(
		state: PasskeyOnlyRegistrationState
	): Promise<PasskeyOnlyRegistrationState | PasskeyOnlyLoginState> {
		const user: User = {
			username: state.username,
			firstname: state.firstname,
			lastname: state.lastname
		};
		try {
			await this.passkey.register(user);
			return {
				...this.buildLoginState('Compte et passkey créés.', user.username),
				messageKind: 'success'
			};
		} catch (cause) {
			return { ...state, message: passkeyError(cause), messageKind: 'error' };
		}
	}

	private async logout(): Promise<PasskeyOnlyLoginState> {
		const response = await fetch(`${BACKEND_BASE_URL}/logout`);
		if (!response.ok) throw new Error('Failed to logout');
		return this.buildLoginState();
	}

	private async runTransition(name: TransitionName): Promise<void> {
		this.currentState = await transitionWithFeedback(this.currentState, name, async () => {
			switch (name) {
				case 'initialize':
					if (this.currentState.kind !== 'initial') throw new Error('Already initialized.');
					return await this.initialize();
				case 'login':
					if (this.currentState.kind !== 'user-login')
						throw new Error('Login requires the login state.');
					return await this.login(this.currentState);
				case 'register':
					if (this.currentState.kind !== 'user-registration')
						throw new Error('Registration requires the registration state.');
					return await this.register(this.currentState);
				case 'logout':
					if (this.currentState.kind !== 'authenticated')
						throw new Error('Log in before logging out.');
					return await this.logout();
				case 'toRegistration':
					if (this.currentState.kind !== 'user-login')
						throw new Error('Registration starts from the login state.');
					return this.buildRegistrationState();
				case 'toLogin':
					if (this.currentState.kind !== 'user-registration')
						throw new Error('Back to login requires the registration state.');
					return this.buildLoginState();
				default: {
					const unexpectedTransition: never = name;
					throw new Error(`Unknown transition: ${unexpectedTransition}`);
				}
			}
		});
	}
}
