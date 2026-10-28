import { demoErrorMessage } from '#lib/demo/logic/errors.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSKEY_ONLY_CHALLENGE_COOKIE } from '#lib/demo/constants.js';
import { COOKIE_OPTIONS } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';
import type { User } from '#lib/demo/models.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const input = await request.json();
	if (
		!input ||
		!['username', 'firstname', 'lastname'].every(
			(field) => typeof input[field] === 'string' && input[field].trim()
		)
	)
		error(400, 'Veuillez renseigner votre identifiant, votre prénom et votre nom.');
	const user: User = {
		username: input.username,
		firstname: input.firstname,
		lastname: input.lastname
	};
	let options;
	try {
		options = await getServices().passkeyManager.beginSignup(user);
	} catch (cause) {
		console.error('Passkey request failed:', cause);
		error(400, demoErrorMessage(cause, 'La création du compte a échoué. Réessayez.'));
	}
	cookies.set(PASSKEY_ONLY_CHALLENGE_COOKIE, options.challenge, COOKIE_OPTIONS);
	return json(options);
};
