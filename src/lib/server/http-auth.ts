import { error, type Cookies } from '@sveltejs/kit';
import type { PasswordLoginRequest, User, UserSession } from '#lib/demo/models.js';
import { getServices } from './services';

export const COOKIE_OPTIONS = { path: '/', httpOnly: true, secure: true, sameSite: 'lax' } as const;

export async function readPasswordLoginRequest(request: Request): Promise<PasswordLoginRequest> {
	const input = await request.json();
	if (typeof input?.username !== 'string' || typeof input?.password !== 'string')
		error(400, 'Veuillez saisir votre identifiant et votre mot de passe.');
	return { username: input.username, password: input.password };
}

export function getDemoSession(cookies: Cookies, cookieName: string): UserSession | undefined {
	const id = cookies.get(cookieName);
	return id ? getServices().sessionManager.loadSession(id) : undefined;
}

export function startDemoSession(cookies: Cookies, cookieName: string, user: User): void {
	endDemoSession(cookies, cookieName);
	const session = getServices().sessionManager.createSessionForUser(user);
	cookies.set(cookieName, session.id, COOKIE_OPTIONS);
}

export function endDemoSession(cookies: Cookies, cookieName: string): void {
	const id = cookies.get(cookieName);
	if (id) getServices().sessionManager.deleteSession(id);
	cookies.delete(cookieName, COOKIE_OPTIONS);
}
