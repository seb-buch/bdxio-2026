import { defineEnvVars } from '@sveltejs/kit/env';
import { DEMO_ORIGIN, DEMO_RP_ID } from './lib/demo/webauthn';

function withDefault(fallback: string): (value: string | undefined) => string {
	return (value) => {
		if (value !== undefined && typeof value !== 'string') {
			throw new Error('Expected a string.');
		}
		return value ?? fallback;
	};
}

export const variables = defineEnvVars({
	DB_PATH: { description: 'Path to the database file' },
	MFA_KEY_PATH: { description: 'Path to the MFA key file' },
	WEBAUTHN_RP_ID: {
		description: 'RP ID used to create and verify passkeys',
		schema: withDefault(DEMO_RP_ID)
	},
	WEBAUTHN_ORIGIN: {
		description: 'Expected public HTTPS origin, including the port if nonstandard',
		schema: withDefault(DEMO_ORIGIN)
	}
});
