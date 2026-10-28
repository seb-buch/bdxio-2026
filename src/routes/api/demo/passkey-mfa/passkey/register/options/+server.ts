import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSKEY_CHALLENGE_COOKIE, PASSKEY_MFA_DEMO_COOKIE } from '#lib/demo/constants.js';
import { COOKIE_OPTIONS, getDemoSession } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';

export const POST: RequestHandler = async ({ cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_MFA_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour ajouter une passkey.');
	const options = await getServices().passkeyManager.beginRegistration(session.user);
	cookies.set(PASSKEY_CHALLENGE_COOKIE, options.challenge, COOKIE_OPTIONS);
	return json(options);
};
