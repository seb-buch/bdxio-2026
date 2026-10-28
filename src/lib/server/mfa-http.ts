import { error, json, text, type RequestHandler } from '@sveltejs/kit';
import { getServices } from './services';
import {
	COOKIE_OPTIONS,
	readPasswordLoginRequest,
	startDemoSession,
	getDemoSession,
	endDemoSession
} from './http-auth';
import {
	MFA_DEMO_COOKIE,
	MFA_CHALLENGE_COOKIE,
	PASSKEY_MFA_DEMO_COOKIE,
	PASSKEY_MFA_CHALLENGE_COOKIE
} from '#lib/demo/constants.js';
import type { MfaVerifyRequest, MfaStatusResponse } from '#lib/demo/models.js';

function createMfaHandlers(
	sessionCookie: string,
	challengeCookie: string
): Record<'login' | 'enroll' | 'verify' | 'status' | 'logout' | 'cancel', RequestHandler> {
	return {
		login: async ({ request, cookies }) => {
			const input = await readPasswordLoginRequest(request);
			const { userWithPasswordManager, mfaChallengeManager } = getServices();
			const user = userWithPasswordManager.authenticate(input);
			if (!user) error(403, 'Identifiant ou mot de passe incorrect.');
			const headers = { 'cache-control': 'no-store' };
			if (!mfaChallengeManager.hasMfa(user)) {
				startDemoSession(cookies, sessionCookie, user);
				return json({ type: 'authenticated', user, mfaEnabled: false }, { headers });
			}
			if (mfaChallengeManager.isRateLimited(user))
				error(429, 'Trop de tentatives. Réessayez dans cinq minutes.');
			const previous = cookies.get(challengeCookie);
			if (previous) mfaChallengeManager.cancelChallenge(previous);
			const challenge = mfaChallengeManager.createLoginChallenge(user);
			cookies.set(challengeCookie, challenge.challengeId, { ...COOKIE_OPTIONS, maxAge: 300 });
			return json(challenge, { headers });
		},
		enroll: async ({ cookies }) => {
			const session = getDemoSession(cookies, sessionCookie);
			if (!session) error(401, 'Connectez-vous pour activer la double authentification.');
			const manager = getServices().mfaChallengeManager;
			if (manager.hasMfa(session.user)) error(409, 'La double authentification est déjà activée.');
			if (manager.isRateLimited(session.user))
				error(429, 'Trop de tentatives. Réessayez dans cinq minutes.');
			const previous = cookies.get(challengeCookie);
			if (previous) manager.cancelChallenge(previous);
			const enrollment = await manager.createEnrollmentChallenge(session.user, session.id);
			cookies.set(challengeCookie, enrollment.challengeId, { ...COOKIE_OPTIONS, maxAge: 300 });
			return json(enrollment, { headers: { 'cache-control': 'no-store' } });
		},
		verify: async ({ request, cookies }) => {
			const input: MfaVerifyRequest = await request.json();
			if (typeof input?.challengeId !== 'string' || typeof input?.code !== 'string')
				error(400, 'Veuillez relancer la vérification et saisir un code.');
			if (cookies.get(challengeCookie) !== input.challengeId)
				error(410, 'La vérification a expiré. Reconnectez-vous.');
			const { mfaChallengeManager } = getServices();
			const result = mfaChallengeManager.verifyChallenge(
				input.challengeId,
				input.code,
				getDemoSession(cookies, sessionCookie)?.id
			);

			if (result.status === 'expired' || result.status === 'rate-limited') {
				cookies.delete(challengeCookie, COOKIE_OPTIONS);
				if (result.status === 'rate-limited')
					error(429, 'Trop de tentatives. Réessayez dans cinq minutes.');
				error(410, 'La vérification a expiré. Reconnectez-vous.');
			}
			if (result.status === 'invalid-code')
				error(
					403,
					'Code incorrect ou déjà utilisé. Saisissez un nouveau code de votre application.'
				);
			startDemoSession(cookies, sessionCookie, result.user);
			cookies.delete(challengeCookie, COOKIE_OPTIONS);

			return json(result.user, { headers: { 'cache-control': 'no-store' } });
		},
		status: async ({ cookies }) => {
			const session = getDemoSession(cookies, sessionCookie);
			if (!session)
				error(401, 'Reconnectez-vous pour consulter les paramètres de double authentification.');
			const response: MfaStatusResponse = {
				mfaEnabled: getServices().mfaChallengeManager.hasMfa(session.user)
			};
			return json(response, { headers: { 'cache-control': 'no-store' } });
		},
		logout: async ({ cookies }) => {
			endDemoSession(cookies, sessionCookie);
			const challengeId = cookies.get(challengeCookie);
			if (challengeId) getServices().mfaChallengeManager.cancelChallenge(challengeId);
			cookies.delete(challengeCookie, COOKIE_OPTIONS);
			return text('logout OK');
		},
		cancel: async ({ request, cookies }) => {
			const input: { challengeId: string } = await request.json();
			if (cookies.get(challengeCookie) === input.challengeId)
				getServices().mfaChallengeManager.cancelChallenge(input.challengeId);
			cookies.delete(challengeCookie, COOKIE_OPTIONS);
			return new Response(null, { status: 204 });
		}
	};
}

export const mfaHandlers = createMfaHandlers(MFA_DEMO_COOKIE, MFA_CHALLENGE_COOKIE);
export const passkeyMfaHandlers = createMfaHandlers(
	PASSKEY_MFA_DEMO_COOKIE,
	PASSKEY_MFA_CHALLENGE_COOKIE
);
