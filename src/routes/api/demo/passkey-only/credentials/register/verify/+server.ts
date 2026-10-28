import { error, type RequestHandler } from '@sveltejs/kit';
import { PASSKEY_ONLY_CHALLENGE_COOKIE, PASSKEY_ONLY_DEMO_COOKIE } from '#lib/demo/constants.js';
import { COOKIE_OPTIONS, getDemoSession } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';
import { demoErrorMessage } from '#lib/demo/logic/errors.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour ajouter une passkey.');
	const challenge = cookies.get(PASSKEY_ONLY_CHALLENGE_COOKIE);
	cookies.delete(PASSKEY_ONLY_CHALLENGE_COOKIE, COOKIE_OPTIONS);
	if (!challenge) error(400, 'Relancez la création de la passkey.');
	const input = await request.json();
	if (
		!input?.credential ||
		typeof input.label !== 'string' ||
		!input.label.trim() ||
		input.label.trim().length > 60
	)
		error(400, 'Choisissez un nom de passkey entre 1 et 60 caractères.');
	try {
		await getServices().passkeyManager.finishRegistration(
			challenge,
			input.credential,
			session.user,
			input.label.trim()
		);
	} catch (cause) {
		error(403, demoErrorMessage(cause, 'La création de la passkey a échoué.'));
	}
	return new Response(null, { status: 204 });
};
