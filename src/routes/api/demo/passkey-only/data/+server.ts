import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PASSKEY_ONLY_DEMO_COOKIE } from '#lib/demo/constants.js';
import { requireDemoDataUser } from '#lib/server/demo-data-http.js';
import { getServices } from '#lib/server/services.js';

export const GET: RequestHandler = ({ cookies, setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	const user = requireDemoDataUser(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	const row = getServices().repository.loadPasskeyOnlyDemoData(user);
	if (!row) error(404, 'Ce compte n’existe plus. Recréez-le dans la démo.');
	return json(row);
};
