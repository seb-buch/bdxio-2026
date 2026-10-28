<script lang="ts">
	import type { AuthenticatedState } from '#lib/demo/logic/common.js';

	type Props = {
		currentState: AuthenticatedState;
		submitting?: boolean;
	};

	let { currentState, submitting = $bindable(false) }: Props = $props();

	async function logout(event: MouseEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		try {
			await currentState.logout();
		} finally {
			submitting = false;
		}
	}
</script>

<div class="demo-account-summary">
	<p class="demo-auth-status">Connexion réussie</p>
	<p class="demo-form-title">Bonjour {currentState.user.firstname} {currentState.user.lastname}</p>
	<p class="demo-form-description">
		Vous êtes connecté avec l’identifiant <strong>{currentState.user.username}</strong>.
	</p>
	<button type="button" onclick={logout} disabled={submitting}
		>{submitting ? 'Déconnexion…' : 'Se déconnecter'}</button
	>
</div>
