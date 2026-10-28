import { BASE_API_URL, MFA_DEMO_COOKIE } from '#lib/demo/constants.js';
import type {
	AuthenticatedState,
	DemoUnavailableState,
	ExposedStateTransition,
	InitialState,
	LoginState,
	RegistrationState,
	State,
	StateTransition
} from '#lib/demo/logic/common.js';
import { PasswordFlow, type PasswordTransitionName } from './password-flow';
import type {
	MfaEnrollmentResponse,
	MfaLoginResponse,
	MfaStatusResponse,
	MfaVerifyRequest,
	User
} from '#lib/demo/models.js';

export interface SecondFactorState extends State {
	kind: 'second-factor';
	readonly challengeId: string;
	readonly username: string;
	message?: string;
	code: string;
	verify: ExposedStateTransition;
	cancel: ExposedStateTransition;
}

export interface OtpEnrollmentState extends State, MfaEnrollmentResponse {
	kind: 'otp-enrollment';
	readonly user: User;
	message?: string;
	code: string;
	verify: ExposedStateTransition;
	cancel: ExposedStateTransition;
}

const BACKEND_BASE_URL = `${BASE_API_URL}/mfa`;
type MfaExtraState = SecondFactorState | OtpEnrollmentState;
export interface MfaAuthenticatedState extends AuthenticatedState {
	mfaEnabled: boolean;
	message?: string;
	activateMfa?: ExposedStateTransition;
}
export type MfaAuthenticationState =
	| DemoUnavailableState
	| InitialState
	| LoginState
	| RegistrationState
	| MfaAuthenticatedState
	| MfaExtraState;
type Transitions = {
	activateMfa: StateTransition<MfaAuthenticatedState, OtpEnrollmentState | MfaAuthenticatedState>;
	verify: StateTransition<MfaExtraState, MfaAuthenticatedState | MfaExtraState | LoginState>;
	cancel: StateTransition<MfaExtraState, MfaAuthenticatedState | LoginState>;
};

export type MfaTransitionName = PasswordTransitionName | keyof Transitions;

export class MfaFlow {
	private readonly password: PasswordFlow;

	constructor(
		private readonly onTransition: (name: MfaTransitionName) => Promise<void>,
		private readonly backendBaseUrl = BACKEND_BASE_URL,
		cookieName = MFA_DEMO_COOKIE
	) {
		this.password = new PasswordFlow(onTransition, backendBaseUrl, cookieName);
	}

	buildInitialState(): InitialState {
		return this.password.buildInitialState();
	}

	private async buildStateAfterLogin(
		response: Response
	): Promise<MfaAuthenticatedState | SecondFactorState> {
		const result: MfaLoginResponse = await response.json();
		if (result.type === 'authenticated')
			return this.buildAuthenticatedState(result.user, result.mfaEnabled);
		return this.buildSecondFactorState(result);
	}

	buildAuthenticatedState(user: User, mfaEnabled = false): MfaAuthenticatedState {
		return {
			...this.password.buildAuthenticatedState(user),
			mfaEnabled,
			activateMfa: mfaEnabled ? undefined : async () => this.onTransition('activateMfa')
		};
	}

	private buildSecondFactorState(
		challenge: { challengeId: string; username: string },
		message?: string
	): SecondFactorState {
		return {
			kind: 'second-factor',
			challengeId: challenge.challengeId,
			username: challenge.username,
			message,
			code: '',
			verify: async () => this.onTransition('verify'),
			cancel: async () => this.onTransition('cancel')
		};
	}

	private buildEnrollmentState(
		challenge: MfaEnrollmentResponse,
		user: User,
		message?: string
	): OtpEnrollmentState {
		return {
			...challenge,
			kind: 'otp-enrollment',
			user,
			message,
			code: '',
			verify: async () => this.onTransition('verify'),
			cancel: async () => this.onTransition('cancel')
		};
	}

	private readonly performActivateMfa: Transitions['activateMfa'] = async (state) => {
		const response = await fetch(`${this.backendBaseUrl}/enroll`, { method: 'POST' });
		if (!response.ok) {
			const body = await response.json();
			const message = response.status < 500 ? body.message : undefined;
			return {
				...state,
				message: message ?? 'Impossible de préparer la double authentification. Réessayez.'
			};
		}
		const challenge: MfaEnrollmentResponse = await response.json();
		return this.buildEnrollmentState(challenge, state.user);
	};

	private readonly performVerify: Transitions['verify'] = async (state) => {
		const input: MfaVerifyRequest = { challengeId: state.challengeId, code: state.code };
		const response = await fetch(`${this.backendBaseUrl}/verify`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(input)
		});
		if (!response.ok) {
			const body = await response.json();
			const message = response.status < 500 ? body.message : undefined;
			if (response.status === 410 || response.status === 429) {
				const nextState = this.password.buildLoginState(
					message ?? 'La vérification a expiré. Reconnectez-vous.'
				);
				nextState.username = state.username;
				return nextState;
			}
			return state.kind === 'otp-enrollment'
				? this.buildEnrollmentState(
						state,
						state.user,
						message ?? 'La vérification a échoué. Saisissez un nouveau code.'
					)
				: this.buildSecondFactorState(
						state,
						message ?? 'La vérification a échoué. Saisissez un nouveau code.'
					);
		}
		return this.buildAuthenticatedState(await response.json(), true);
	};

	private readonly performCancel: Transitions['cancel'] = async (state) => {
		const response = await fetch(`${this.backendBaseUrl}/cancel`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ challengeId: state.challengeId })
		});
		if (!response.ok) throw new Error('Failed to cancel verification');
		if (state.kind === 'otp-enrollment') return this.buildAuthenticatedState(state.user);
		const nextState = this.password.buildLoginState();
		nextState.username = state.username;
		return nextState;
	};

	private async runPasswordTransition(
		name: PasswordTransitionName,
		state: MfaAuthenticationState
	): Promise<MfaAuthenticationState> {
		if (state.kind === 'second-factor' || state.kind === 'otp-enrollment')
			throw new Error(`Impossible to ${name} from state: ${state.kind}`);
		const nextState = await this.password.runTransition(name, state);
		if (nextState instanceof Response) return this.buildStateAfterLogin(nextState);
		if (nextState.kind === 'authenticated') return this.loadAuthenticatedState(nextState.user);
		return nextState;
	}

	async loadAuthenticatedState(user: User): Promise<MfaAuthenticatedState> {
		const response = await fetch(`${this.backendBaseUrl}/status`);
		if (!response.ok) throw new Error('Failed to load MFA settings');
		const { mfaEnabled }: MfaStatusResponse = await response.json();
		return this.buildAuthenticatedState(user, mfaEnabled);
	}

	async runTransition(
		name: MfaTransitionName,
		state: MfaAuthenticationState
	): Promise<MfaAuthenticationState> {
		switch (name) {
			case 'initialize':
			case 'login':
			case 'logout':
			case 'register':
			case 'toLogin':
			case 'toRegistration':
				return this.runPasswordTransition(name, state);
			case 'activateMfa':
				if (state.kind !== 'authenticated' || state.mfaEnabled)
					throw new Error('MFA enrollment requires a logged-in account without MFA');
				return this.performActivateMfa(state);
			case 'verify':
			case 'cancel':
				if (state.kind !== 'second-factor' && state.kind !== 'otp-enrollment')
					throw new Error(`Impossible to ${name} from state: ${state.kind}`);
				return name === 'verify' ? this.performVerify(state) : this.performCancel(state);
			default: {
				const unexpectedTransition: never = name;
				throw new Error(`Unknown MFA transition: ${unexpectedTransition}`);
			}
		}
	}
}
