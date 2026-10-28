import type { User } from '#lib/demo/models.js';
import { DemoError, demoErrorMessage } from './errors';

export interface PasskeyRegistrationExchange {
	options: PublicKeyCredentialCreationOptionsJSON;
	response:
		| ReturnType<PublicKeyCredential['toJSON']>
		| { credential: ReturnType<PublicKeyCredential['toJSON']>; label: string };
}

export interface PasskeyAuthenticationExchange {
	options: PublicKeyCredentialRequestOptionsJSON;
	response: ReturnType<PublicKeyCredential['toJSON']>;
}

interface PasskeyAuthenticationResult {
	user: User;
	exchange: PasskeyAuthenticationExchange;
}

export class PasskeyClient {
	constructor(private readonly baseUrl: string) {}

	async register(user?: User, label?: string): Promise<PasskeyRegistrationExchange> {
		this.requireNativeWebAuthn();
		const optionsJSON: PublicKeyCredentialCreationOptionsJSON = await (
			await this.post('/register/options', user)
		).json();
		const credential = await navigator.credentials.create({
			publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(optionsJSON)
		});
		if (!(credential instanceof PublicKeyCredential))
			throw new DemoError('La création de la passkey a échoué. Réessayez.');
		const credentialJSON = credential.toJSON();
		const response = label ? { credential: credentialJSON, label } : credentialJSON;
		await this.post('/register/verify', response);
		return { options: optionsJSON, response };
	}

	async login(username?: string): Promise<PasskeyAuthenticationResult> {
		this.requireNativeWebAuthn();
		const optionsJSON: PublicKeyCredentialRequestOptionsJSON = await (
			await this.post('/login/options', { username })
		).json();
		const credential = await navigator.credentials.get({
			publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(optionsJSON)
		});
		if (!(credential instanceof PublicKeyCredential))
			throw new DemoError('La connexion avec la passkey a échoué. Réessayez.');
		const response = credential.toJSON();
		const user: User = await (await this.post('/login/verify', response)).json();
		return { user, exchange: { options: optionsJSON, response } };
	}

	async autofill(signal: AbortSignal): Promise<PasskeyAuthenticationResult | undefined> {
		this.requireNativeWebAuthn();
		if (!(await PublicKeyCredential.isConditionalMediationAvailable?.())) return;
		signal.throwIfAborted();
		const optionsJSON: PublicKeyCredentialRequestOptionsJSON = await (
			await this.post('/login/options', { autofill: true }, signal)
		).json();
		signal.throwIfAborted();
		const credential = await navigator.credentials.get({
			publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(optionsJSON),
			mediation: 'conditional',
			signal
		});
		signal.throwIfAborted();
		if (!(credential instanceof PublicKeyCredential)) return;
		const response = credential.toJSON();
		const user: User = await (await this.post('/login/verify', response, signal)).json();
		return { user, exchange: { options: optionsJSON, response } };
	}

	private requireNativeWebAuthn(): void {
		if (
			typeof PublicKeyCredential === 'undefined' ||
			!navigator.credentials ||
			typeof PublicKeyCredential.parseCreationOptionsFromJSON !== 'function' ||
			typeof PublicKeyCredential.parseRequestOptionsFromJSON !== 'function' ||
			typeof PublicKeyCredential.prototype.toJSON !== 'function'
		) {
			throw new DemoError(
				'Ce navigateur ne prend pas en charge les méthodes WebAuthn nécessaires. Utilisez un navigateur à jour.'
			);
		}
	}

	private async post(path: string, body?: unknown, signal?: AbortSignal): Promise<Response> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'POST',
			signal,
			headers: { 'content-type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body)
		});
		if (!response.ok) {
			const error = await response.json();
			throw new DemoError(
				response.status < 500 && typeof error.message === 'string'
					? error.message
					: 'Le serveur n’a pas pu terminer l’opération. Réessayez.'
			);
		}
		return response;
	}
}

export function passkeyError(cause: unknown): string {
	if (cause instanceof Error) {
		if (cause.name === 'NotAllowedError' || cause.name === 'AbortError')
			return 'Opération annulée ou délai dépassé. Réessayez.';
	}
	if (!(cause instanceof DemoError)) console.error('Passkey operation failed:', cause);
	return demoErrorMessage(cause, 'L’opération avec la passkey a échoué. Réessayez.');
}
