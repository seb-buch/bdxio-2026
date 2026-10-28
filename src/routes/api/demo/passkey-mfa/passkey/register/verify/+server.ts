import { demoErrorMessage } from '#lib/demo/logic/errors.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSKEY_CHALLENGE_COOKIE, PASSKEY_MFA_DEMO_COOKIE } from '#lib/demo/constants.js';
import { COOKIE_OPTIONS, getDemoSession } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_MFA_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour ajouter une passkey.');
	const challenge = cookies.get(PASSKEY_CHALLENGE_COOKIE);
	cookies.delete(PASSKEY_CHALLENGE_COOKIE, COOKIE_OPTIONS);
	if (!challenge) error(400, 'Relancez la création de la passkey.');
	const response = await request.json();
	try {
		await getServices().passkeyManager.finishRegistration(challenge, response, session.user);
	} catch (cause) {
		console.error('Passkey request failed:', cause);
		error(403, demoErrorMessage(cause, 'La création de la passkey a échoué. Réessayez.'));
	}
	return new Response(null, { status: 204 });
};
