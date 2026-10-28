import { text, type RequestHandler } from '@sveltejs/kit';
import { PASSKEY_ONLY_DEMO_COOKIE } from '#lib/demo/constants.js';
import { endDemoSession } from '#lib/server/http-auth.js';

export const GET: RequestHandler = ({ cookies }) => {
	endDemoSession(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	return text('logout OK');
};
