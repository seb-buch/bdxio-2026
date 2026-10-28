import { constants, Database } from 'bun:sqlite';
import schemaSql from './schema.sql?raw';
import type { UserRepository } from './user';
import type { UserWithPassword, UserWithPasswordRepository } from './password';
import * as crypto from 'node:crypto';
import type {
	DemoUserRow,
	DemoPasskeyCredential,
	PasswordDemoDataRow,
	MfaDemoDataRow,
	PasskeyMfaDemoDataRow,
	PasskeyOnlyDemoDataRow,
	User,
	UserSession
} from '#lib/demo/models.js';
import type { TotpCredentials, TotpRepository } from './mfa';
import type { PasskeyRepository } from './passkey';
import type { WebAuthnCredential } from '@simplewebauthn/server';
import { DemoError } from '#lib/demo/logic/errors.js';

export interface SessionRepository {
	createSession(session: UserSession): void;
	loadSession(sessionId: string): UserSession | undefined;
	deleteSession(sessionId: string): void;
}

export class SqliteRepository
	implements
		UserRepository,
		UserWithPasswordRepository,
		SessionRepository,
		TotpRepository,
		PasskeyRepository
{
	private readonly database: Database;

	constructor(private readonly dbPath: string) {
		this.database = new Database(dbPath, { create: true });
		this.database.run('PRAGMA journal_mode = WAL;');
		this.database.run('PRAGMA foreign_keys = ON;');
		this.database.run(schemaSql);
		// Existing local demo databases predate user-editable credential labels.
		const columns = this.database
			.query<{ name: string }, []>('PRAGMA table_info(passkey_credentials)')
			.all();
		if (!columns.some(({ name }) => name === 'label')) {
			this.database.run(
				"ALTER TABLE passkey_credentials ADD COLUMN label TEXT NOT NULL DEFAULT 'Passkey'"
			);
		}

		process.once('SIGINT', () => {
			this.terminate();
		});

		process.once('SIGTERM', () => {
			this.terminate();
		});

		console.log(`Sqlite database initialized using ${dbPath}`);
	}
	resetDemoData(): void {
		this.database.transaction(() => {
			this.database.run('DELETE FROM sessions');
			// Foreign keys cascade to password, TOTP and passkey credentials.
			this.database.run('DELETE FROM users');
		})();
	}

	getUserFromUsername(username: string): User | undefined {
		const query = this.database.query<User, { $username: string }>(`
			SELECT username, firstname , lastname
			FROM users
			WHERE username = $username
		`);

		return query.get({ $username: username }) ?? undefined;
	}

	getUserId(user: User): string {
		return this.database
			.query<{ id: string }, [string]>('SELECT id FROM users WHERE username = ?')
			.get(user.username)!.id;
	}

	loadPasswordDemoData(user: User): PasswordDemoDataRow | undefined {
		const row = this.database
			.query<DemoUserRow & { password_hash: string | null }, [string]>(
				`
			SELECT users.id AS user_id, username, firstname, lastname, password_hash
			FROM users
			LEFT JOIN password_credentials ON password_credentials.user_id = users.id
			WHERE users.username = ?
		`
			)
			.get(user.username);
		if (!row) return undefined;
		const { password_hash, ...identity } = row;
		return password_hash === null ? identity : { ...identity, password_hash };
	}

	loadMfaDemoData(user: User): MfaDemoDataRow | undefined {
		const row = this.loadPasswordDemoData(user);
		if (!row) return undefined;
		const totp = this.loadTotpCredentials(user);
		return totp
			? { ...row, totp_secret: totp.encryptedSecret, totp_last_used_counter: totp.lastUsedCounter }
			: row;
	}

	loadPasskeyMfaDemoData(user: User): PasskeyMfaDemoDataRow | undefined {
		const row = this.loadMfaDemoData(user);
		if (!row) return undefined;
		const passkeys = this.loadDemoPasskeyCredentials(row.user_id);
		return passkeys.length ? { ...row, passkeys_credentials: passkeys } : row;
	}

	loadPasskeyOnlyDemoData(user: User): PasskeyOnlyDemoDataRow | undefined {
		// Include any legacy credentials too: their absence must be real, not a projection.
		return this.loadPasskeyMfaDemoData(user);
	}

	getUserFromPasskeyId(id: string): User | undefined {
		return (
			this.database
				.query<User, [string]>(
					`
			SELECT username, firstname, lastname FROM users
			JOIN passkey_credentials ON passkey_credentials.user_id = users.id
			WHERE passkey_credentials.id = ?
		`
				)
				.get(id) ?? undefined
		);
	}

	private loadDemoPasskeyCredentials(userId: string): DemoPasskeyCredential[] {
		return this.database
			.query<
				{ id: string; label: string; public_key: Uint8Array; counter: number; transports: string },
				[string]
			>(
				`
			SELECT id, label, public_key, counter, transports
			FROM passkey_credentials WHERE user_id = ? ORDER BY id
		`
			)
			.all(userId)
			.map((credential) => ({
				...credential,
				public_key: Buffer.from(credential.public_key).toString('base64')
			}));
	}

	loadPasskeys(user: User): WebAuthnCredential[] {
		return this.database
			.query<{ id: string; public_key: Uint8Array; counter: number; transports: string }, [string]>(
				`
			SELECT passkey_credentials.id, public_key, counter, transports
			FROM passkey_credentials JOIN users ON users.id = passkey_credentials.user_id
			WHERE username = ?
		`
			)
			.all(user.username)
			.map((row) => ({
				id: row.id,
				publicKey: Uint8Array.from(row.public_key),
				counter: row.counter,
				transports: JSON.parse(row.transports)
			}));
	}

	addPasskey(user: User, credential: WebAuthnCredential, label = 'Passkey'): void {
		this.database
			.query(
				`
			INSERT INTO passkey_credentials (id, user_id, public_key, counter, transports, label)
			SELECT $id, users.id, $publicKey, $counter, $transports, $label FROM users WHERE username = $username
		`
			)
			.run({
				$id: credential.id,
				$username: user.username,
				$publicKey: credential.publicKey,
				$counter: credential.counter,
				$label: label,
				$transports: JSON.stringify(credential.transports ?? [])
			});
	}

	listPasskeys(user: User): { id: string; label: string }[] {
		return this.database
			.query<{ id: string; label: string }, [string]>(
				`
			SELECT id, label FROM passkey_credentials
			WHERE user_id = (SELECT id FROM users WHERE username = ?) ORDER BY rowid
		`
			)
			.all(user.username);
	}

	renamePasskey(user: User, id: string, label: string): void {
		const result = this.database
			.query(
				`
			UPDATE passkey_credentials SET label = ?
			WHERE id = ? AND user_id = (SELECT id FROM users WHERE username = ?)
		`
			)
			.run(label, id, user.username);
		if (!result.changes) throw new DemoError('Passkey inconnue pour ce compte.');
	}

	removePasskey(user: User, id: string): void {
		this.database.transaction(() => {
			const credentials = this.listPasskeys(user);
			if (!credentials.some((credential) => credential.id === id))
				throw new DemoError('Passkey inconnue pour ce compte.');
			if (credentials.length <= 1)
				throw new DemoError('Conservez au moins une passkey pour accéder au compte.');
			this.database
				.query(
					`
				DELETE FROM passkey_credentials WHERE id = ?
				AND user_id = (SELECT id FROM users WHERE username = ?)
			`
				)
				.run(id, user.username);
		})();
	}

	updatePasskeyCounter(id: string, counter: number): void {
		this.database.query('UPDATE passkey_credentials SET counter = ? WHERE id = ?').run(counter, id);
	}

	addUser(user: User, userId: string = crypto.randomUUID()): void {
		const query = this.database.query(`
			INSERT INTO users (id, username, firstname, lastname)
			VALUES ($id, $username, $firstname, $lastname)
		`);

		query.run({
			$id: userId,
			$username: user.username,
			$firstname: user.firstname,
			$lastname: user.lastname
		});
	}

	addUserWithPasskey(user: User, userId: string, credential: WebAuthnCredential): void {
		this.database.transaction(() => {
			this.addUser(user, userId);
			this.addPasskey(user, credential);
		})();
	}

	addUserWithPassword(user: UserWithPassword): 'success' | 'duplicate' {
		return this.database
			.transaction((): 'success' | 'duplicate' => {
				if (this.getUserFromUsername(user.username)) return 'duplicate';

				this.addUser(user);
				this.setPasswordForUser(user, user.password);
				return 'success';
			})
			.immediate();
	}

	setPasswordForUser(user: User, password: string): null {
		const passwordHash = Bun.password.hashSync(password, {
			algorithm: 'argon2id'
		});

		const query = this.database.query(`
			INSERT INTO password_credentials (user_id, password_hash)
			SELECT id, $password_hash FROM users WHERE username = $username
			ON CONFLICT(user_id) DO UPDATE
			SET password_hash = excluded.password_hash
		`);
		const result = query.run({
			$username: user.username,
			$password_hash: passwordHash
		});

		if (result.changes === 0) {
			throw new Error(`Cannot set password: user '${user.username}' does not exist.`);
		}

		return null;
	}

	verifyPasswordForUser(user: User, password: string): 'success' | 'failure' {
		const query = this.database.query<{ password_hash: string }, { $username: string }>(`
			SELECT credentials.password_hash
			FROM password_credentials AS credentials
			JOIN users ON users.id = credentials.user_id
			WHERE users.username = $username
		`);
		const credentials = query.get({ $username: user.username });

		if (!credentials) {
			return 'failure';
		}

		return Bun.password.verifySync(password, credentials.password_hash) ? 'success' : 'failure';
	}

	terminate() {
		console.log(`Closing connection to database '${this.dbPath}'`);
		this.database.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);
		this.database.run('PRAGMA wal_checkpoint(TRUNCATE);');
		this.database.close();
	}

	public createSession(session: UserSession): void {
		const query = this.database.query(`
			INSERT INTO sessions (id, user_id)
			SELECT $id, users.id
			FROM users
			WHERE users.username = $username
		`);
		const result = query.run({
			$id: session.id,
			$username: session.user.username
		});

		if (result.changes === 0) {
			throw new Error(`Cannot create session: user '${session.user.username}' does not exist.`);
		}
	}

	loadSession(sessionId: string): UserSession | undefined {
		const query = this.database.query<
			{
				id: string;
				username: string;
				firstname: string;
				lastname: string;
			},
			{ $id: string }
		>(`
			SELECT sessions.id, users.username, users.firstname, users.lastname
			FROM sessions
			JOIN users ON users.id = sessions.user_id
			WHERE sessions.id = $id
		`);
		const row = query.get({ $id: sessionId });
		if (!row) return undefined;

		return {
			id: row.id,
			user: {
				username: row.username,
				firstname: row.firstname,
				lastname: row.lastname
			}
		};
	}

	deleteSession(sessionId: string): void {
		this.database.query('DELETE FROM sessions WHERE id = ?').run(sessionId);
	}

	listTotpCredentials(): { username: string; encryptedSecret: string }[] {
		return this.database
			.query<{ username: string; encryptedSecret: string }, []>(
				`
			SELECT username, encrypted_secret AS encryptedSecret
			FROM totp_credentials JOIN users ON users.id = totp_credentials.user_id
		`
			)
			.all();
	}

	deleteTotpCredentials(username: string): void {
		this.database
			.query(
				'DELETE FROM totp_credentials WHERE user_id = (SELECT id FROM users WHERE username = ?)'
			)
			.run(username);
	}

	loadTotpCredentials(user: User): TotpCredentials | undefined {
		const row = this.database
			.query<{ encrypted_secret: string; last_used_counter: number }, [string]>(
				`
			SELECT encrypted_secret, last_used_counter
			FROM totp_credentials JOIN users ON users.id = totp_credentials.user_id
			WHERE username = ?
		`
			)
			.get(user.username);
		return row
			? { encryptedSecret: row.encrypted_secret, lastUsedCounter: row.last_used_counter }
			: undefined;
	}

	enrollTotp(user: User, encryptedSecret: string, counter: number): boolean {
		const result = this.database
			.query(
				`
			INSERT INTO totp_credentials (user_id, encrypted_secret, last_used_counter)
			SELECT id, $secret, $counter FROM users WHERE username = $username
			ON CONFLICT(user_id) DO NOTHING
		`
			)
			.run({ $username: user.username, $secret: encryptedSecret, $counter: counter });
		return result.changes === 1;
	}

	consumeTotpCounter(user: User, counter: number): boolean {
		const result = this.database
			.query(
				`
			UPDATE totp_credentials SET last_used_counter = $counter
			WHERE user_id = (SELECT id FROM users WHERE username = $username)
			AND last_used_counter < $counter
		`
			)
			.run({ $username: user.username, $counter: counter });
		return result.changes === 1;
	}
}
