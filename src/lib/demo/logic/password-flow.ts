import { BASE_API_URL, DEMO_UNAVAILABLE, PASSWORD_DEMO_COOKIE } from '#lib/demo/constants.js';
import type { PasswordLoginRequest, User, UserWithPassword } from '#lib/demo/models.js';
import type {
	AuthenticatedState,
	DemoUnavailableState,
	InitialState,
	LoginState,
	RegistrationState,
	StateTransition
} from '#lib/demo/logic/common.js';
import { authenticateUsingCookie } from '#lib/demo/helpers.js';
import { dev } from '$app/env';

const BACKEND_BASE_URL = `${BASE_API_URL}/password`;

export type PasswordAuthenticationState =
	DemoUnavailableState | InitialState | LoginState | RegistrationState | AuthenticatedState;

type Transitions = {
	initialize: StateTransition<InitialState, DemoUnavailableState | LoginState | AuthenticatedState>;
	// Successful login has a different payload in each demo; its manager builds the next state.
	login: (state: LoginState) => Promise<LoginState | Response>;
	logout: StateTransition<AuthenticatedState, LoginState>;
	toRegistration: StateTransition<LoginState, RegistrationState>;
	toLogin: StateTransition<RegistrationState, LoginState>;
	register: StateTransition<RegistrationState, RegistrationState | LoginState>;
};

export type PasswordTransitionName = keyof Transitions;

// Shared password states and transitions; each demo owns its reactive state.
export class PasswordFlow {
	constructor(
		private readonly onTransition: (name: PasswordTransitionName) => Promise<void>,
		private readonly backendBaseUrl = BACKEND_BASE_URL,
		private readonly cookieName = PASSWORD_DEMO_COOKIE
	) {}

	public buildInitialState(): InitialState {
		return {
			kind: 'initial',

			initialize: async () => this.onTransition('initialize')
		};
	}

	public buildLoginState(message?: string): LoginState {
		return {
			kind: 'user-login',

			message,
			username: '',
			password: '',

			login: async () => this.onTransition('login'),
			toRegistration: async () => this.onTransition('toRegistration')
		};
	}

	public buildAuthenticatedState(user: User): AuthenticatedState {
		return {
			kind: 'authenticated',

			user,
			logout: async () => this.onTransition('logout')
		};
	}

	private buildRegistrationState(message?: string): RegistrationState {
		return {
			kind: 'user-registration',

			firstname: '',
			lastname: '',
			username: '',
			password: '',
			message,

			register: async () => this.onTransition('register'),
			toLogin: async () => this.onTransition('toLogin')
		};
	}

	private readonly performInitialize: Transitions['initialize'] = async () => {
		if (!dev) {
			return DEMO_UNAVAILABLE;
		}

		const authentication = await authenticateUsingCookie(this.cookieName);

		if (authentication.state === 'authenticated')
			return this.buildAuthenticatedState(authentication.user);

		return this.buildLoginState();
	};

	private readonly performLogout: Transitions['logout'] = async () => {
		const rawResponse = await fetch(`${this.backendBaseUrl}/logout`);

		if (!rawResponse.ok) throw new Error('Failed to logout');

		return this.buildLoginState();
	};

	private readonly performLogin: Transitions['login'] = async (state: LoginState) => {
		const input: PasswordLoginRequest = {
			username: state.username,
			password: state.password
		};

		const rawResponse = await fetch(`${this.backendBaseUrl}/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(input)
		});

		if (!rawResponse.ok) {
			let message = 'La connexion a échoué. Réessayez.';
			const response = await rawResponse.json();
			if (rawResponse.status < 500 && response.message) message = response.message;
			const newState = this.buildLoginState(message);
			newState.username = state.username;
			return newState;
		}

		return rawResponse;
	};

	private readonly performRegistration: Transitions['register'] = async (
		state: RegistrationState
	) => {
		const input: UserWithPassword = {
			username: state.username,
			firstname: state.firstname,
			lastname: state.lastname,
			password: state.password
		};

		const response = await fetch(`${BACKEND_BASE_URL}/register`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(input)
		});

		if (!response.ok) {
			const body = await response.json();
			const newState = this.buildRegistrationState(
				response.status === 409
					? 'Cet identifiant existe déjà.'
					: response.status < 500 && body.message
						? body.message
						: 'L’inscription a échoué. Veuillez réessayer.'
			);

			newState.firstname = state.firstname;
			newState.lastname = state.lastname;
			newState.username = state.username;

			return newState;
		}

		const newState = this.buildLoginState('Compte créé.');
		newState.messageKind = 'success';
		newState.username = state.username;
		return newState;
	};

	private readonly performToLogin: Transitions['toLogin'] = async () => {
		return this.buildLoginState();
	};

	private readonly performToRegistration: Transitions['toRegistration'] = async () => {
		return this.buildRegistrationState();
	};

	public async runTransition(
		name: PasswordTransitionName,
		state: PasswordAuthenticationState
	): Promise<PasswordAuthenticationState | Response> {
		switch (name) {
			case 'initialize':
				if (state.kind !== 'initial') throw new Error('Cannot initialize when already initialized');
				return this.performInitialize(state);
			case 'login':
				if (state.kind !== 'user-login')
					throw new Error(`Impossible to login from state: ${state.kind}`);
				return this.performLogin(state);
			case 'logout':
				if (state.kind !== 'authenticated')
					throw new Error(`Impossible to logout from state: ${state.kind}`);
				return this.performLogout(state);
			case 'register':
				if (state.kind !== 'user-registration')
					throw new Error(`Impossible to register from state: ${state.kind}`);
				return this.performRegistration(state);
			case 'toLogin':
				if (state.kind !== 'user-registration')
					throw new Error(`Impossible to transition to login from state: ${state.kind}`);
				return this.performToLogin(state);
			case 'toRegistration':
				if (state.kind !== 'user-login')
					throw new Error(`Impossible to transition to registration from state: ${state.kind}`);
				return this.performToRegistration(state);
			default: {
				const unexpectedTransition: never = name;
				throw new Error(`Unknown transition: ${unexpectedTransition}`);
			}
		}
	}
}
