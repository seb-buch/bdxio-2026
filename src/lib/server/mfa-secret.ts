import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function loadOrCreateMfaKey(keyPath: string): Buffer {
	if (existsSync(keyPath)) return readFileSync(keyPath);

	const key = randomBytes(32);
	writeFileSync(keyPath, key, { mode: 0o600 });
	return key;
}

export class MfaSecretCipher {
	constructor(private readonly key: Buffer) {
		if (key.length !== 32) throw new Error('The MFA encryption key must contain 32 bytes.');
	}

	encrypt(secret: string, username: string): string {
		const iv = randomBytes(12);
		const cipher = createCipheriv('aes-256-gcm', this.key, iv);
		cipher.setAAD(Buffer.from(username));
		const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
		return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64');
	}

	decrypt(encryptedSecret: string, username: string): string {
		const data = Buffer.from(encryptedSecret, 'base64');
		const decipher = createDecipheriv('aes-256-gcm', this.key, data.subarray(0, 12));
		decipher.setAAD(Buffer.from(username));
		decipher.setAuthTag(data.subarray(12, 28));
		return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8');
	}
}
