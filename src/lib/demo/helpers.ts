import type { MeEndpointResponse, User } from '#lib/demo/models.js';
import { BASE_API_URL } from './constants';

type Authenticated = {
	state: 'authenticated';
	user: User;
};

type NotAuthenticated = {
	state: 'not_authenticated';
};

export async function authenticateUsingCookie(
	cookie: string
): Promise<Authenticated | NotAuthenticated> {
	const rawResponse = await fetch(`${BASE_API_URL}/me?cookie-name=${cookie}`);
	if (!rawResponse.ok) throw new Error(`API is broken: ${rawResponse.statusText}`);
	const response: MeEndpointResponse = await rawResponse.json();

	if (response.type !== 'authenticated') return { state: 'not_authenticated' };

	return { state: 'authenticated', user: response.user };
}
