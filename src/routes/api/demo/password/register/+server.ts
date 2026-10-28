import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { getServices } from '#lib/server/services.js';
import type { User, UserWithPassword } from '#lib/demo/models.js';
import { passwordPolicyError } from '#lib/demo/logic/password-policy.js';

export const POST: RequestHandler = async ({ request }) => {
	const newUser: UserWithPassword = await request.json();
	if (
		!newUser ||
		!['username', 'firstname', 'lastname'].every(
			(field) =>
				typeof newUser[field as keyof User] === 'string' && newUser[field as keyof User].trim()
		)
	)
		error(400, 'Veuillez renseigner les informations du compte.');
	const passwordError = passwordPolicyError(newUser.password);
	if (passwordError) error(400, passwordError);

	const manager = getServices().userWithPasswordManager;

	if (manager.addUserWithPassword(newUser) === 'duplicate') {
		error(409, 'Cet identifiant existe déjà.');
	}

	const response: User = {
		username: newUser.username,
		firstname: newUser.firstname,
		lastname: newUser.lastname
	};
	return json(response, {
		status: 201,
		headers: { 'cache-control': 'no-store' }
	});
};
