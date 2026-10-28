import { Secret, TOTP } from 'otpauth';
import QRCode from 'qrcode';
import type { MfaEnrollmentResponse, User } from '#lib/demo/models.js';
import { MfaSecretCipher } from './mfa-secret';

export interface TotpCredentials {
	encryptedSecret: string;
	lastUsedCounter: number;
}
export interface TotpRepository {
	listTotpCredentials(): { username: string; encryptedSecret: string }[];
	deleteTotpCredentials(username: string): void;
	loadTotpCredentials(user: User): TotpCredentials | undefined;
	enrollTotp(user: User, encryptedSecret: string, counter: number): boolean;
	consumeTotpCounter(user: User, counter: number): boolean;
}

const CHALLENGE_LIFETIME_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
type PendingChallenge = { user: User; expiresAt: number } & (
	{ type: 'login' } | { type: 'enrollment'; secret: string; sessionId: string }
);
type VerificationResult =
	| { status: 'verified'; user: User }
	| { status: 'invalid-code' }
	| { status: 'expired' }
	| { status: 'rate-limited' };

export function createTotp(secret: string, username: string): TOTP {
	return new TOTP({
		issuer: 'BDX I/O 2026 démo',
		label: username,
		secret,
		algorithm: 'SHA1',
		digits: 6,
		period: 30
	});
}

export class MfaChallengeManager {
	private readonly challenges = new Map<string, PendingChallenge>();
	private readonly failures = new Map<string, { count: number; expiresAt: number }>();

	constructor(
		private readonly repository: TotpRepository,
		private readonly cipher: MfaSecretCipher
	) {
		for (const { username, encryptedSecret } of repository.listTotpCredentials()) {
			try {
				cipher.decrypt(encryptedSecret, username);
			} catch {
				repository.deleteTotpCredentials(username);
			}
		}
	}

	reset(): void {
		this.challenges.clear();
		this.failures.clear();
	}

	hasMfa(user: User): boolean {
		return this.repository.loadTotpCredentials(user) !== undefined;
	}

	isRateLimited(user: User): boolean {
		const failures = this.failures.get(user.username);
		return !!failures && failures.expiresAt > Date.now() && failures.count >= MAX_ATTEMPTS;
	}

	createLoginChallenge(user: User): {
		type: 'second-factor';
		challengeId: string;
		username: string;
	} {
		const challengeId = this.addChallenge({
			type: 'login',
			user,
			expiresAt: Date.now() + CHALLENGE_LIFETIME_MS
		});
		return { type: 'second-factor', challengeId, username: user.username };
	}

	async createEnrollmentChallenge(user: User, sessionId: string): Promise<MfaEnrollmentResponse> {
		const secret = new Secret({ size: 20 }).base32;
		const uri = createTotp(secret, user.username).toString();
		const qrCodeDataUrl = await QRCode.toDataURL(uri, { width: 320, margin: 4 });
		const challengeId = this.addChallenge({
			type: 'enrollment',
			user,
			secret,
			sessionId,
			expiresAt: Date.now() + CHALLENGE_LIFETIME_MS
		});
		return { challengeId, username: user.username, qrCodeDataUrl, secret };
	}

	verifyChallenge(challengeId: string, code: string, sessionId?: string): VerificationResult {
		const challenge = this.challenges.get(challengeId);
		if (
			!challenge ||
			challenge.expiresAt <= Date.now() ||
			(challenge.type === 'enrollment' && challenge.sessionId !== sessionId)
		) {
			this.challenges.delete(challengeId);
			return { status: 'expired' };
		}
		if (this.isRateLimited(challenge.user)) return { status: 'rate-limited' };

		const credentials = this.repository.loadTotpCredentials(challenge.user);
		if (challenge.type === 'enrollment' ? !!credentials : !credentials) {
			this.challenges.delete(challengeId);
			return { status: 'expired' };
		}
		const secret =
			challenge.type === 'enrollment'
				? challenge.secret
				: this.cipher.decrypt(credentials!.encryptedSecret, challenge.user.username);
		const totp = createTotp(secret, challenge.user.username);
		const timestamp = Date.now();
		const delta = /^[0-9]{6}$/.test(code)
			? totp.validate({ token: code, timestamp, window: 1 })
			: null;
		const counter = delta === null ? null : totp.counter({ timestamp }) + delta;

		if (counter === null) return this.rejectCode(challenge.user);
		const accepted =
			challenge.type === 'enrollment'
				? this.repository.enrollTotp(
						challenge.user,
						this.cipher.encrypt(secret, challenge.user.username),
						counter
					)
				: this.repository.consumeTotpCounter(challenge.user, counter);
		if (!accepted) return this.rejectCode(challenge.user);

		this.challenges.delete(challengeId);
		this.failures.delete(challenge.user.username);
		return { status: 'verified', user: challenge.user };
	}

	cancelChallenge(challengeId: string): void {
		this.challenges.delete(challengeId);
	}

	private rejectCode(user: User): VerificationResult {
		let failures = this.failures.get(user.username);
		if (!failures || failures.expiresAt <= Date.now())
			failures = { count: 0, expiresAt: Date.now() + CHALLENGE_LIFETIME_MS };
		failures.count++;
		this.failures.set(user.username, failures);
		return { status: failures.count >= MAX_ATTEMPTS ? 'rate-limited' : 'invalid-code' };
	}

	private addChallenge(challenge: PendingChallenge): string {
		for (const [id, pending] of this.challenges)
			if (pending.expiresAt <= Date.now()) this.challenges.delete(id);
		for (const [username, failure] of this.failures)
			if (failure.expiresAt <= Date.now()) this.failures.delete(username);
		const id = crypto.randomUUID();
		this.challenges.set(id, challenge);
		return id;
	}
}
