import { demoErrorMessage } from './errors';
import { testPasswordCandidate, type PasswordAttackMessage } from './password-attack';

self.onmessage = (event: MessageEvent<{ encoded: string; candidate: string }>) => {
	const send = (message: PasswordAttackMessage) => self.postMessage(message);
	try {
		const { encoded, candidate } = event.data;
		send({ type: 'result', ...testPasswordCandidate(encoded, candidate) });
	} catch (cause) {
		send({
			type: 'error',
			message: demoErrorMessage(cause, 'Le calcul a échoué. Réessayez.')
		});
	}
};
