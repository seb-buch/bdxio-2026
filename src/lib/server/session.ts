import type { SessionRepository } from './storage';
import type { User, UserSession } from '#lib/demo/models.js';

export class SessionManager {
	constructor(private readonly repository: SessionRepository) {}

	public createSessionForUser(user: User): UserSession {
		const session: UserSession = {
			id: crypto.randomUUID(),
			user
		};
		this.repository.createSession(session);
		return session;
	}

	public loadSession(sessionId: string): UserSession | undefined {
		return this.repository.loadSession(sessionId);
	}

	public deleteSession(sessionId: string): void {
		this.repository.deleteSession(sessionId);
	}
}
