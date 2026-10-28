import { dev } from '$app/env';
import { error, type Cookies } from '@sveltejs/kit';
import type { User } from '#lib/demo/models.js';
import { getDemoSession } from './http-auth';

// Only the local-demo session check is shared. Each endpoint selects its own data.
export function requireDemoDataUser(cookies: Cookies, sessionCookie: string): User {
	if (!dev) error(404, 'La démo interactive est disponible en local.');
	const session = getDemoSession(cookies, sessionCookie);
	if (!session)
		error(401, 'Connectez-vous pour afficher les données d’authentification enregistrées.');
	return session.user;
}
