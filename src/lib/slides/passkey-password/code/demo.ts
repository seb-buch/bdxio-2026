import type { WebAuthnCredential } from '@simplewebauthn/server';

export interface User {
	id: Uint8Array<ArrayBuffer>;
	username: string;
	displayName: string;
	passkeys: Credentials[];
}

interface Credentials {
	id: string;
	transports?: string[];
}

export interface PasskeyRepository {
	getUserPasskeys: (user: User) => WebAuthnCredential[];
	getUserPasskey: (user: User, credentialID: string) => WebAuthnCredential;

	savePasskey(credential: WebAuthnCredential): void;
	updatePasskeyCounter(id: string, counter: number): void;
}

export interface WebAuthnChallengeStore {
	addChallenge: (challenge: string, type: 'registration' | 'authentication', user: User) => void;
	popChallenge: (type: 'registration' | 'authentication', user: User) => string;
}
