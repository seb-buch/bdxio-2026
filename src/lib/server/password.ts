import { UserManager, type UserRepository } from './user';
import type { PasswordLoginRequest, User } from '#lib/demo/models.js';

export type UserWithPassword = User & {
	password: string;
};

export interface UserWithPasswordRepository extends UserRepository {
	addUserWithPassword(user: UserWithPassword): 'success' | 'duplicate';
	setPasswordForUser(user: User, password: string): null;
	verifyPasswordForUser(user: User, password: string): 'success' | 'failure';
}

export class UserWithPasswordManager extends UserManager {
	constructor(protected repository: UserWithPasswordRepository) {
		super(repository);
	}

	public addUserWithPassword(user: UserWithPassword): 'success' | 'duplicate' {
		return this.repository.addUserWithPassword(user);
	}

	public setPasswordForUser(user: User, password: string) {
		this.repository.setPasswordForUser(user, password);
	}

	public verifyPasswordForUser(user: User, password: string): 'success' | 'failure' {
		return this.repository.verifyPasswordForUser(user, password);
	}

	public authenticate(input: PasswordLoginRequest): User | undefined {
		const user = this.getUserFromUsername(input.username);
		return user && this.verifyPasswordForUser(user, input.password) === 'success'
			? user
			: undefined;
	}
}
