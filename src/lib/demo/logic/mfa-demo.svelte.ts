import { transitionWithFeedback } from './feedback';
import { MfaFlow, type MfaAuthenticationState, type MfaTransitionName } from './mfa-flow';

export type { SecondFactorState, OtpEnrollmentState } from './mfa-flow';

export class MfaAuthenticationStateManager {
	private readonly mfa = new MfaFlow((name) => this.runTransition(name));
	public currentState: MfaAuthenticationState = $state(this.mfa.buildInitialState());

	private async runTransition(name: MfaTransitionName): Promise<void> {
		this.currentState = await transitionWithFeedback(this.currentState, name, async () => {
			return await this.mfa.runTransition(name, this.currentState);
		});
	}
}
