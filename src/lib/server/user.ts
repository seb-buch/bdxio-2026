import type { User } from '#lib/demo/models.js';

export interface UserRepository {
	getUserFromUsername(username: string): User | undefined;
	addUser(user: User): void;
}

export class UserManager {
	constructor(protected repository: UserRepository) {}

	public getUserFromUsername(username: string): User | undefined {
		return this.repository.getUserFromUsername(username);
	}

	public addUser(user: User) {
		this.repository.addUser(user);
	}
}
