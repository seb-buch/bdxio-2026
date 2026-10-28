import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { getServices } from '#lib/server/services.js';
import { PASSWORD_DEMO_COOKIE } from '#lib/demo/constants.js';
import { readPasswordLoginRequest, startDemoSession } from '#lib/server/http-auth.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const input = await readPasswordLoginRequest(request);
	const { userWithPasswordManager } = getServices();
	const user = userWithPasswordManager.authenticate(input);
	if (!user) error(403, 'Identifiant ou mot de passe incorrect.');
	startDemoSession(cookies, PASSWORD_DEMO_COOKIE, user);

	return json(user, {
		headers: { 'cache-control': 'no-store' }
	});
};
