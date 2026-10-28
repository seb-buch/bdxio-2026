import type { RegistrationResponseJSON } from '@simplewebauthn/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { PasskeyRepository, User, WebAuthnChallengeStore } from './demo';

export async function verifyAndStorePasskey(
	responseJson: RegistrationResponseJSON,
	user: User,
	repository: PasskeyRepository,
	challengeStore: WebAuthnChallengeStore
) {
	const { verified, registrationInfo } = await verifyRegistrationResponse({
		response: responseJson,
		expectedChallenge: challengeStore.popChallenge('registration', user),
		expectedOrigin: 'https://bdxio2026.demo',
		expectedRPID: 'bdxio2026.demo',
		requireUserVerification: false
	});
	if (!verified || !registrationInfo) {
		throw new Error('Passkey registration failed.');
	}

	repository.savePasskey(registrationInfo.credential);
}
