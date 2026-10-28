import { type RequestHandler, text } from '@sveltejs/kit';
import { PASSWORD_DEMO_COOKIE } from '#lib/demo/constants.js';
import { endDemoSession } from '#lib/server/http-auth.js';

export const GET: RequestHandler = async ({ cookies }): Promise<Response> => {
	endDemoSession(cookies, PASSWORD_DEMO_COOKIE);

	return text('logout OK');
};
