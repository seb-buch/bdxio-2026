import type { DemoUnavailableState } from '#lib/demo/logic/common.js';

export const PASSWORD_DEMO_COOKIE = 'password-demo';
export const MFA_DEMO_COOKIE = 'mfa-demo';
export const MFA_CHALLENGE_COOKIE = 'mfa-challenge';
export const PASSKEY_MFA_DEMO_COOKIE = 'passkey-mfa-demo';
export const PASSKEY_MFA_CHALLENGE_COOKIE = 'passkey-mfa-challenge';
export const PASSKEY_CHALLENGE_COOKIE = 'passkey-challenge';
export const PASSKEY_ONLY_DEMO_COOKIE = 'passkey-only-demo';
export const PASSKEY_ONLY_CHALLENGE_COOKIE = 'passkey-only-challenge';
export const BASE_API_URL = '/api/demo';
export const DEMO_UNAVAILABLE: DemoUnavailableState = {
	kind: 'unavailable',
	message: 'La démo interactive est disponible en local.'
};
