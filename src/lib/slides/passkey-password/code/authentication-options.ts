import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { PasskeyRepository, User, WebAuthnChallengeStore } from './demo';

export async function createAuthenticationOptions(
	user: User,
	repository: PasskeyRepository,
	challengeStore: WebAuthnChallengeStore
) {
	const options = await generateAuthenticationOptions({
		rpID: 'bdxio2026.demo',
		allowCredentials: repository.getUserPasskeys(user),
		userVerification: 'preferred'
	});
	challengeStore.addChallenge(options.challenge, 'authentication', user);
	return options;
}
