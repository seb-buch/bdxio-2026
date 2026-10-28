import { DB_PATH, MFA_KEY_PATH, WEBAUTHN_ORIGIN, WEBAUTHN_RP_ID } from '$app/env/private';
import { SessionManager } from './session';
import { UserWithPasswordManager } from './password';
import { SqliteRepository } from './storage';
import { MfaChallengeManager } from './mfa';
import { loadOrCreateMfaKey, MfaSecretCipher } from './mfa-secret';
import { PasskeyManager } from './passkey';

export class Settings {
	constructor(
		readonly dbPath: string,
		readonly mfaKeyPath: string,
		readonly rpID: string,
		readonly origin: string
	) {}

	static fromEnv(): Settings {
		return new Settings(DB_PATH, MFA_KEY_PATH, WEBAUTHN_RP_ID, WEBAUTHN_ORIGIN);
	}
}

type Services = {
	repository: SqliteRepository;
	sessionManager: SessionManager;
	userWithPasswordManager: UserWithPasswordManager;
	mfaChallengeManager: MfaChallengeManager;
	passkeyManager: PasskeyManager;
};

let services: Services | undefined;

export function initializeServices(settings: Settings) {
	const repository = new SqliteRepository(settings.dbPath);

	services = {
		repository,
		sessionManager: new SessionManager(repository),
		userWithPasswordManager: new UserWithPasswordManager(repository),
		passkeyManager: new PasskeyManager(repository, settings.rpID, settings.origin),
		mfaChallengeManager: new MfaChallengeManager(
			repository,
			new MfaSecretCipher(loadOrCreateMfaKey(settings.mfaKeyPath))
		)
	};
}

export function getServices(): Services {
	if (!services) {
		throw new Error('Services not initialized');
	}
	return services;
}

export function resetDemoData(): void {
	const { repository, mfaChallengeManager, passkeyManager } = getServices();
	repository.resetDemoData();
	mfaChallengeManager.reset();
	passkeyManager.reset();
}
