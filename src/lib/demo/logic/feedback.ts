import type { State } from './common';

export function clearFeedback(state: State): void {
	if (state.kind === 'unavailable') return;
	state.message = undefined;
	state.messageKind = undefined;
}

const transitionErrors: Record<string, string> = {
	login: 'La connexion a échoué. Réessayez.',
	loginWithPasskey: 'La connexion avec la passkey a échoué. Réessayez.',
	logout: 'La déconnexion a échoué. Réessayez avec le bouton Se déconnecter.',
	register: 'La création du compte a échoué. Réessayez.',
	registerPasskey: 'La création de la passkey a échoué. Réessayez.',
	activateMfa: 'Impossible de préparer la double authentification. Réessayez.',
	verify: 'La vérification a échoué. Réessayez avec un nouveau code.',
	cancel: 'Impossible d’annuler la vérification. Réessayez.'
};

export async function transitionWithFeedback<T extends State>(
	state: T,
	name: string,
	transition: () => Promise<T>
): Promise<T> {
	clearFeedback(state);
	try {
		return await transition();
	} catch (cause) {
		// Initialization has its own presentation-wide error and recovery instruction.
		if (name === 'initialize') throw cause;
		console.error(`Demo transition failed (${name}):`, cause);
		return {
			...state,
			message: transitionErrors[name] ?? 'L’opération a échoué. Réessayez.',
			messageKind: 'error'
		};
	}
}
