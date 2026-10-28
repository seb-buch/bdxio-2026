import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PASSKEY_ONLY_DEMO_COOKIE } from '#lib/demo/constants.js';
import { getDemoSession } from '#lib/server/http-auth.js';
import { getServices } from '#lib/server/services.js';
import { demoErrorMessage } from '#lib/demo/logic/errors.js';

export const GET: RequestHandler = ({ cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour gérer vos passkeys.');
	return json(getServices().repository.listPasskeys(session.user));
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour gérer vos passkeys.');
	const input = await request.json();
	if (
		typeof input?.id !== 'string' ||
		typeof input?.label !== 'string' ||
		!input.label.trim() ||
		input.label.trim().length > 60
	)
		error(400, 'Choisissez un nom de passkey entre 1 et 60 caractères.');
	try {
		getServices().repository.renamePasskey(session.user, input.id, input.label.trim());
	} catch (cause) {
		error(400, demoErrorMessage(cause, 'Impossible de renommer la passkey.'));
	}
	return new Response(null, { status: 204 });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const session = getDemoSession(cookies, PASSKEY_ONLY_DEMO_COOKIE);
	if (!session) error(401, 'Connectez-vous pour gérer vos passkeys.');
	const input = await request.json();
	if (typeof input?.id !== 'string') error(400, 'Choisissez la passkey à retirer.');
	try {
		getServices().repository.removePasskey(session.user, input.id);
	} catch (cause) {
		error(400, demoErrorMessage(cause, 'Impossible de retirer la passkey.'));
	}
	return new Response(null, { status: 204 });
};
