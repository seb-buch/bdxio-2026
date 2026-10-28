import type { User, WebAuthnChallengeStore } from './demo';
import {
	generateRegistrationOptions,
	type PublicKeyCredentialCreationOptionsJSON
} from '@simplewebauthn/server';

export async function createRegistrationOptions(
	user: User,
	challengeStore: WebAuthnChallengeStore
): Promise<PublicKeyCredentialCreationOptionsJSON> {
	const options = await generateRegistrationOptions({
		rpName: 'BDX I/O 2026 démo',
		rpID: 'bdxio2026.demo',
		userID: user.id,
		userName: user.username,
		userDisplayName: user.displayName,
		excludeCredentials: user.passkeys,
		attestationType: 'none',
		authenticatorSelection: {
			residentKey: 'required',
			userVerification: 'preferred'
		}
	});
	challengeStore.addChallenge(options.challenge, 'registration', user);
	return options;
}
