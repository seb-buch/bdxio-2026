import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PASSKEY_MFA_DEMO_COOKIE } from '#lib/demo/constants.js';
import { getDemoSession } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';

export const GET: RequestHandler = ({ cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_MFA_DEMO_COOKIE);
	if (!session) error(401, 'Reconnectez-vous pour consulter les passkeys du compte.');
	return json({ passkeyEnabled: getServices().passkeyManager.hasPasskey(session.user) });
};
