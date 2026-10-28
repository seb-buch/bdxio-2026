import type { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import type { PasskeyRepository, User, WebAuthnChallengeStore } from './demo';

export async function verifyPasskeyAuthentication(
	authenticationResponse: AuthenticationResponseJSON,
	user: User,
	repository: PasskeyRepository,
	challengeStore: WebAuthnChallengeStore
) {
	const { verified, authenticationInfo } = await verifyAuthenticationResponse({
		response: authenticationResponse,
		expectedChallenge: challengeStore.popChallenge('authentication', user),
		expectedOrigin: 'https://bdxio2026.demo',
		expectedRPID: 'bdxio2026.demo',
		credential: repository.getUserPasskey(user, authenticationResponse.id),
		requireUserVerification: false
	});
	if (!verified) throw new Error('Passkey authentication failed.');
	repository.updatePasskeyCounter(authenticationInfo.credentialID, authenticationInfo.newCounter);
	return user;
}
