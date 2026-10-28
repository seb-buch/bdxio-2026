import type { User } from '#lib/demo/models.js';

export interface State {
	readonly kind: string;
	message?: string;
	messageKind?: 'success' | 'error';
}

export interface DemoUnavailableState extends State {
	readonly kind: 'unavailable';
	readonly message: 'La démo interactive est disponible en local.';
}

export type ExposedStateTransition = () => Promise<void>;
export type StateTransition<From extends State, To extends State> = (state: From) => Promise<To>;

export interface InitialState extends State {
	kind: 'initial';
	initialize: ExposedStateTransition;
}

export interface AuthenticatedState extends State {
	kind: 'authenticated';
	user: User;
	logout: ExposedStateTransition;
}

export interface LoginState extends State {
	kind: 'user-login';
	message?: string;
	username: string;
	password: string;
	login: ExposedStateTransition;
	toRegistration: ExposedStateTransition;
}

export interface RegistrationState extends State {
	kind: 'user-registration';
	message?: string;
	username: string;
	firstname: string;
	lastname: string;
	password: string;
	toLogin: ExposedStateTransition;
	register: ExposedStateTransition;
}
