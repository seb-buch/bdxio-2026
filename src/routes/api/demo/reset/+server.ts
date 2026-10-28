import { dev } from '$app/env';
import { WEBAUTHN_ORIGIN } from '$app/env/private';
import { error, type RequestHandler } from '@sveltejs/kit';
import {
	PASSWORD_DEMO_COOKIE,
	MFA_DEMO_COOKIE,
	MFA_CHALLENGE_COOKIE,
	PASSKEY_MFA_DEMO_COOKIE,
	PASSKEY_MFA_CHALLENGE_COOKIE,
	PASSKEY_CHALLENGE_COOKIE,
	PASSKEY_ONLY_DEMO_COOKIE,
	PASSKEY_ONLY_CHALLENGE_COOKIE
} from '#lib/demo/constants.js';
import { COOKIE_OPTIONS } from '#lib/server/http-auth.js';
import { resetDemoData } from '#lib/server/services.js';

export const POST: RequestHandler = ({ request, url, cookies }) => {
	if (!dev) error(404, 'La démo interactive est disponible en local.');
	// Vite reconstructs an HTTP URL behind the TLS-terminating nginx proxy.
	// Use the configured public origin for that host, without trusting forwarded headers.
	const publicUrl = new URL(WEBAUTHN_ORIGIN);
	const expectedOrigin = url.host === publicUrl.host ? publicUrl.origin : url.origin;
	if (request.headers.get('origin') !== expectedOrigin) error(403, 'Origine non autorisée.');
	resetDemoData();
	for (const name of [
		PASSWORD_DEMO_COOKIE,
		MFA_DEMO_COOKIE,
		MFA_CHALLENGE_COOKIE,
		PASSKEY_MFA_DEMO_COOKIE,
		PASSKEY_MFA_CHALLENGE_COOKIE,
		PASSKEY_CHALLENGE_COOKIE,
		PASSKEY_ONLY_DEMO_COOKIE,
		PASSKEY_ONLY_CHALLENGE_COOKIE
	]) {
		// Set-Cookie expires the browser's HttpOnly cookies, even if none were sent.
		cookies.delete(name, COOKIE_OPTIONS);
	}
	return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
};
