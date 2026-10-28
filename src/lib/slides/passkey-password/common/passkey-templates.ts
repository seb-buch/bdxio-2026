import type {
	PasskeyAuthenticationExchange,
	PasskeyRegistrationExchange
} from '#lib/demo/logic/passkey-client.js';
import registrationOptionsTemplate from '../code/registration-options.jsonc?raw';
import registrationResponseTemplate from '../code/registration-response.jsonc?raw';
import authenticationOptionsTemplate from '../code/authentication-options.jsonc?raw';
import authenticationResponseTemplate from '../code/authentication-response.jsonc?raw';

type RegistrationOptions = Pick<
	PublicKeyCredentialCreationOptionsJSON,
	'challenge' | 'rp' | 'user' | 'excludeCredentials'
>;

const defaultRegistrationOptions: RegistrationOptions = {
	challenge: 'jfGgypC4uITac_gAEDa0yQ32XQht-Iu-eYeLyA4R4D5jw',
	rp: { name: 'BDX I/O 2026 démo', id: 'bdxio2026.demo' },
	user: { id: 'ZXhhbXBsZS1hY2NvdW50LWlk', name: 'alice', displayName: 'Alice Martin' },
	excludeCredentials: []
};

const defaultRegistrationResponse: RegistrationResponseJSON = {
	id: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
	rawId: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
	type: 'public-key',
	authenticatorAttachment: 'platform',
	response: {
		clientDataJSON:
			'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiamZHZ3lwQzR1SVRhY19nQUVEYTB5UTMyWFFodC1JdS1lWWVMeUE0UjRENWp3Iiwib3JpZ2luIjoiaHR0cHM6Ly9iZHhpbzIwMjYuZGVtbyIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
		attestationObject:
			'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVikNWJN3iQ0cToMAUQA1iqvKEiodR2b64FCki9naWVftiJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAIG49Ap7VQtAUn7-u9lk0Fhy0ukQr4Tqc1mNzHYoq6_88pQECAyYgASFYIIO2NrEC7zgKTgTVmehES-Ip7CdN_i6tFMJkpykeFJG1IlggqnOrAor8HTA3KrzCfY9eOZO90Fl2ofrH4XzwhLXJ1IY',
		authenticatorData:
			'NWJN3iQ0cToMAUQA1iqvKEiodR2b64FCki9naWVftiJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAIG49Ap7VQtAUn7-u9lk0Fhy0ukQr4Tqc1mNzHYoq6_88pQECAyYgASFYIIO2NrEC7zgKTgTVmehES-Ip7CdN_i6tFMJkpykeFJG1IlggqnOrAor8HTA3KrzCfY9eOZO90Fl2ofrH4XzwhLXJ1IY',
		publicKey:
			'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEg7Y2sQLvOApOBNWZ6ERL4insJ03-Lq0UwmSnKR4UkbWqc6sCivwdMDcqvMJ9j145k73QWXah-sfhfPCEtcnUhg',
		publicKeyAlgorithm: -7,
		transports: ['internal']
	},
	clientExtensionResults: { credProps: { rk: true } }
};

const defaultAuthenticationOptions: PublicKeyCredentialRequestOptionsJSON = {
	rpId: 'bdxio2026.demo',
	challenge: 'yoyZEGZPzdkoF3nhEswcoLLTgsqnHx4Am4D5m7NZ7vA',
	allowCredentials: [
		{
			id: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
			type: 'public-key',
			transports: ['internal']
		}
	],
	timeout: 60000,
	userVerification: 'preferred'
};

const defaultAuthenticationResponse: AuthenticationResponseJSON = {
	id: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
	rawId: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
	type: 'public-key',
	authenticatorAttachment: 'platform',
	response: {
		clientDataJSON:
			'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoieW95WkVHWlB6ZGtvRjNuaEVzd2NvTExUZ3Nxbkh4NEFtNEQ1bTdOWjd2QSIsIm9yaWdpbiI6Imh0dHBzOi8vYmR4aW8yMDI2LmRlbW8iLCJjcm9zc09yaWdpbiI6ZmFsc2V9',
		authenticatorData: 'NWJN3iQ0cToMAUQA1iqvKEiodR2b64FCki9naWVftiIFAAAAAQ',
		signature:
			'MEYCIQDJlA03JcCbL0T2-Cv_OlWiL7KSZBDG13q7GjMkZP3FDQIhAI6muyTl0cWtDTXZLfWnoSxYl3JOWjUJGTuPzdXVbBaV',
		userHandle: 'ZXhhbXBsZS1hY2NvdW50LWlk'
	},
	clientExtensionResults: {}
};

function injectValues(template: string, data: object): string {
	return template.replace(/"\{\{([\w.]+)}}"/g, (_, path: string) => {
		const value = path.split('.').reduce<unknown>((value, field) => {
			return value && typeof value === 'object'
				? (value as Record<string, unknown>)[field]
				: undefined;
		}, data);
		if (path === 'excludeCredentials') return Array.isArray(value) && value.length ? '[…]' : '[]';
		return JSON.stringify(value ?? null);
	});
}

export function formatRegistrationOptions(
	options: RegistrationOptions = defaultRegistrationOptions
): string {
	return injectValues(registrationOptionsTemplate, options);
}

export function formatRegistrationResponse(
	response: PasskeyRegistrationExchange['response'] = defaultRegistrationResponse
): string {
	return injectValues(
		registrationResponseTemplate,
		'credential' in response ? response.credential : response
	);
}

export function formatAuthenticationOptions(
	options: PublicKeyCredentialRequestOptionsJSON = defaultAuthenticationOptions
): string {
	return injectValues(authenticationOptionsTemplate, options);
}

export function formatAuthenticationResponse(
	response: PasskeyAuthenticationExchange['response'] = defaultAuthenticationResponse
): string {
	return injectValues(authenticationResponseTemplate, response);
}
