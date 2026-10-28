import { demoErrorMessage } from '#lib/demo/logic/errors.js';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import {
	PASSKEY_CHALLENGE_COOKIE,
	PASSKEY_MFA_DEMO_COOKIE,
	PASSKEY_ONLY_CHALLENGE_COOKIE,
	PASSKEY_ONLY_DEMO_COOKIE
} from '#lib/demo/constants.js';
import { COOKIE_OPTIONS, startDemoSession } from './http-auth';
import { getServices } from './services';

function createPasskeyLoginHandlers(
	sessionCookie: string,
	challengeCookie: string
): Record<'options' | 'verify', RequestHandler> {
	return {
		options: async ({ request, cookies }) => {
			const input = await request.json();
			const username = input?.username;
			const useDiscoverable = input?.autofill === true;
			if (!useDiscoverable && (typeof username !== 'string' || !username))
				error(400, 'Veuillez saisir votre identifiant.');
			let options;
			try {
				const manager = getServices().passkeyManager;
				options = useDiscoverable
					? await manager.beginDiscoverableAuthentication()
					: await manager.beginAuthentication(username);
			} catch (cause) {
				console.error('Passkey request failed:', cause);
				error(400, demoErrorMessage(cause, 'La connexion avec la passkey a échoué. Réessayez.'));
			}
			cookies.set(challengeCookie, options.challenge, COOKIE_OPTIONS);
			return json(options);
		},
		verify: async ({ request, cookies }) => {
			const challenge = cookies.get(challengeCookie);
			cookies.delete(challengeCookie, COOKIE_OPTIONS);
			if (!challenge) error(400, 'Relancez la connexion avec votre passkey.');
			const response = await request.json();
			let user;
			try {
				user = await getServices().passkeyManager.finishAuthentication(challenge, response);
			} catch (cause) {
				console.error('Passkey request failed:', cause);
				error(403, demoErrorMessage(cause, 'La connexion avec la passkey a échoué. Réessayez.'));
			}
			startDemoSession(cookies, sessionCookie, user);
			return json(user);
		}
	};
}

export const passkeyMfaLoginHandlers = createPasskeyLoginHandlers(
	PASSKEY_MFA_DEMO_COOKIE,
	PASSKEY_CHALLENGE_COOKIE
);
export const passkeyOnlyLoginHandlers = createPasskeyLoginHandlers(
	PASSKEY_ONLY_DEMO_COOKIE,
	PASSKEY_ONLY_CHALLENGE_COOKIE
);
