import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { MeEndpointResponse } from '#lib/demo/models.js';
import { getDemoSession } from '#lib/server/http-auth.js';

const UNAUTHENTICATED_USER: MeEndpointResponse = {
	type: 'unauthenticated'
};

export const GET: RequestHandler = async ({ url, cookies }): Promise<Response> => {
	const cookieName = url.searchParams.get('cookie-name') ?? 'nonexistent';
	const session = getDemoSession(cookies, cookieName);
	const headers = { 'cache-control': 'no-store' };
	if (!session) return json(UNAUTHENTICATED_USER, { headers });

	const response: MeEndpointResponse = {
		type: 'authenticated',
		user: session.user
	};

	return json(response, { headers });
};
