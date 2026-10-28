import { demoErrorMessage } from '#lib/demo/logic/errors.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSKEY_ONLY_CHALLENGE_COOKIE } from '#lib/demo/constants.js';
import { COOKIE_OPTIONS } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const challenge = cookies.get(PASSKEY_ONLY_CHALLENGE_COOKIE);
	cookies.delete(PASSKEY_ONLY_CHALLENGE_COOKIE, COOKIE_OPTIONS);
	if (!challenge) error(400, 'Relancez la création du compte.');
	const response = await request.json();
	try {
		await getServices().passkeyManager.finishSignup(challenge, response);
	} catch (cause) {
		console.error('Passkey request failed:', cause);
		error(403, demoErrorMessage(cause, 'La création du compte a échoué. Réessayez.'));
	}
	return new Response(null, { status: 204 });
};
