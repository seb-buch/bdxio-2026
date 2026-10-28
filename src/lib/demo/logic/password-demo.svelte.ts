import { transitionWithFeedback } from './feedback';
import {
	PasswordFlow,
	type PasswordAuthenticationState,
	type PasswordTransitionName
} from './password-flow';

export class PasswordAuthenticationStateManager {
	private readonly password = new PasswordFlow((name) => this.runTransition(name));
	public currentState: PasswordAuthenticationState = $state(this.password.buildInitialState());

	private async runTransition(name: PasswordTransitionName): Promise<void> {
		this.currentState = await transitionWithFeedback(this.currentState, name, async () => {
			const nextState = await this.password.runTransition(name, this.currentState);
			return nextState instanceof Response
				? this.password.buildAuthenticatedState(await nextState.json())
				: nextState;
		});
	}
}
