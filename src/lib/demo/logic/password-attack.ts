import { DemoError } from './errors';
import { argon2id } from '@noble/hashes/argon2.js';

export function parseArgon2id(encoded: string) {
	const match =
		/^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/.exec(encoded);
	if (!match) throw new DemoError('Empreinte Argon2id non reconnue.');
	const [, memory, iterations, parallelism, saltText, digestText] = match;
	const m = Number(memory),
		t = Number(iterations),
		p = Number(parallelism);
	if (m < 8 * p || m > 262144 || t < 1 || t > 10 || p < 1 || p > 16) {
		throw new DemoError('Paramètres trop coûteux pour cette démonstration dans le navigateur.');
	}
	const decode = (text: string) =>
		Uint8Array.from(atob(text), (character) => character.charCodeAt(0));
	const salt = decode(saltText);
	const digest = decode(digestText);
	if (salt.length < 8 || digest.length < 4 || digest.length > 64)
		throw new DemoError('Empreinte invalide.');
	return { m, t, p, salt, digest, saltText, digestText };
}

// Runs in a Web Worker: only the copied PHC string and the candidate are needed.
export function testPasswordCandidate(encoded: string, candidate: string) {
	const { m, t, p, salt, digest } = parseArgon2id(encoded);
	const computed = argon2id(candidate, salt, {
		m,
		t,
		p,
		dkLen: digest.length,
		version: 0x13,
		maxmem: 256 * 1024 * 1024
	});
	const computedText = btoa(String.fromCharCode(...computed)).replace(/=+$/, '');
	return { matches: computed.every((byte, index) => byte === digest[index]), computedText };
}

export type PasswordAttackMessage =
	{ type: 'result'; matches: boolean; computedText: string } | { type: 'error'; message: string };
