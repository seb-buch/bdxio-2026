import { DemoError } from '#lib/demo/logic/errors.js';
import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
	type RegistrationResponseJSON,
	type AuthenticationResponseJSON,
	type WebAuthnCredential
} from '@simplewebauthn/server';
import type { User } from '#lib/demo/models.js';
import type { UserRepository } from './user';

export interface PasskeyRepository extends UserRepository {
	getUserId(user: User): string;
	getUserFromPasskeyId(id: string): User | undefined;
	loadPasskeys(user: User): WebAuthnCredential[];
	addPasskey(user: User, credential: WebAuthnCredential, label?: string): void;
	addUserWithPasskey(user: User, userId: string, credential: WebAuthnCredential): void;
	updatePasskeyCounter(id: string, counter: number): void;
}

type PendingCeremony =
	| { type: 'registration' | 'authentication'; user: User }
	| { type: 'signup'; user: User; userId: string };
type DiscoverableCeremony = { type: 'discoverable-authentication' };

export class PasskeyManager {
	private readonly challenges = new Map<string, PendingCeremony | DiscoverableCeremony>();

	constructor(
		private readonly repository: PasskeyRepository,
		private readonly rpID: string,
		private readonly origin: string
	) {
		const site = new URL(origin);
		if (site.origin !== origin || site.hostname !== rpID || site.protocol !== 'https:') {
			throw new Error('Configure an HTTPS origin whose hostname matches WEBAUTHN_RP_ID.');
		}
	}

	reset(): void {
		this.challenges.clear();
	}

	hasPasskey(user: User): boolean {
		return this.repository.loadPasskeys(user).length > 0;
	}

	async beginRegistration(user: User) {
		const options = await this.registrationOptions(user, this.repository.getUserId(user));
		this.challenges.set(options.challenge, { type: 'registration', user });
		return options;
	}

	async beginSignup(user: User) {
		if (this.repository.getUserFromUsername(user.username))
			throw new DemoError('Cet identifiant existe déjà.');
		const userId = crypto.randomUUID();
		const options = await this.registrationOptions(user, userId);
		this.challenges.set(options.challenge, { type: 'signup', user, userId });
		return options;
	}

	async finishSignup(challenge: string, response: RegistrationResponseJSON): Promise<User> {
		const pending = this.takeChallenge(challenge);
		if (pending.type !== 'signup') throw new DemoError('Relancez la création du compte.');
		const credential = await this.verifyRegistration(challenge, response);
		this.repository.addUserWithPasskey(pending.user, pending.userId, credential);
		return pending.user;
	}

	private registrationOptions(user: User, userId: string) {
		return generateRegistrationOptions({
			rpName: 'BDX I/O 2026 démo',
			rpID: this.rpID,
			userID: new TextEncoder().encode(userId),
			userName: user.username,
			userDisplayName: `${user.firstname} ${user.lastname}`,
			attestationType: 'none',
			excludeCredentials: this.repository.loadPasskeys(user),
			authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' }
		});
	}

	async finishRegistration(
		challenge: string,
		response: RegistrationResponseJSON,
		user: User,
		label?: string
	) {
		const pending = this.takeChallenge(challenge);
		if (pending.type !== 'registration' || pending.user.username !== user.username)
			throw new DemoError('Relancez la création de la passkey.');
		const credential = await this.verifyRegistration(challenge, response);
		this.repository.addPasskey(user, credential, label);
	}

	private async verifyRegistration(
		challenge: string,
		response: RegistrationResponseJSON
	): Promise<WebAuthnCredential> {
		const { verified, registrationInfo } = await verifyRegistrationResponse({
			response,
			expectedChallenge: challenge,
			expectedOrigin: this.origin,
			expectedRPID: this.rpID,
			requireUserVerification: false
		});
		if (!verified || !registrationInfo)
			throw new DemoError('La création de la passkey a échoué. Réessayez.');
		return registrationInfo.credential;
	}

	async beginAuthentication(username: string) {
		const user = this.repository.getUserFromUsername(username);
		if (!user) throw new DemoError('Cet identifiant est inconnu.');
		const credentials = this.repository.loadPasskeys(user);
		if (!credentials.length)
			throw new DemoError('Aucune passkey n’est enregistrée pour ce compte.');
		const options = await generateAuthenticationOptions({
			rpID: this.rpID,
			allowCredentials: credentials,
			userVerification: 'preferred'
		});
		this.challenges.set(options.challenge, { type: 'authentication', user });
		return options;
	}

	async beginDiscoverableAuthentication() {
		const options = await generateAuthenticationOptions({
			rpID: this.rpID,
			allowCredentials: [],
			userVerification: 'preferred'
		});
		this.challenges.set(options.challenge, { type: 'discoverable-authentication' });
		return options;
	}

	async finishAuthentication(
		challenge: string,
		response: AuthenticationResponseJSON
	): Promise<User> {
		const pending = this.takeChallenge(challenge);
		if (pending.type !== 'authentication' && pending.type !== 'discoverable-authentication')
			throw new DemoError('Relancez la connexion avec votre passkey.');
		const user =
			pending.type === 'authentication'
				? pending.user
				: this.repository.getUserFromPasskeyId(response.id);
		if (!user) throw new DemoError('Passkey inconnue.');
		if (pending.type === 'discoverable-authentication') {
			const expectedHandle = Buffer.from(this.repository.getUserId(user)).toString('base64url');
			if (response.response.userHandle !== expectedHandle)
				throw new DemoError('La passkey ne correspond pas au compte.');
		}
		const credential = this.repository.loadPasskeys(user).find(({ id }) => id === response.id);
		if (!credential) throw new DemoError('Cette passkey n’est pas enregistrée pour ce compte.');
		const { verified, authenticationInfo } = await verifyAuthenticationResponse({
			response,
			expectedChallenge: challenge,
			expectedOrigin: this.origin,
			expectedRPID: this.rpID,
			credential,
			requireUserVerification: false
		});
		if (!verified) throw new DemoError('La connexion avec la passkey a échoué. Réessayez.');
		this.repository.updatePasskeyCounter(credential.id, authenticationInfo.newCounter);
		return user;
	}

	private takeChallenge(challenge: string): PendingCeremony | DiscoverableCeremony {
		const pending = this.challenges.get(challenge);
		this.challenges.delete(challenge);
		if (!pending)
			throw new DemoError('La demande a expiré. Relancez l’opération avec votre passkey.');
		return pending;
	}
}
