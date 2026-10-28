<script lang="ts">
	import type { PasskeyOnlyRegistrationState } from '#lib/demo/logic/passkey-only-demo.svelte.js';

	type Props = { currentState: PasskeyOnlyRegistrationState; allowLogin?: boolean };
	const { currentState = $bindable(), allowLogin = true }: Props = $props();
	let submitting = $state(false);

	async function register(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		try {
			await currentState.register();
		} finally {
			submitting = false;
		}
	}
</script>

<p class="demo-form-title">Créer un compte avec une passkey</p>
<form class="demo-account-form" onsubmit={register}>
	<fieldset disabled={submitting}>
		<legend>Informations du compte</legend>
		<label>
			Identifiant
			<input bind:value={currentState.username} autocomplete="username" required />
		</label>
		<label>
			Prénom
			<input bind:value={currentState.firstname} autocomplete="given-name" required />
		</label>
		<label>
			Nom
			<input bind:value={currentState.lastname} autocomplete="family-name" required />
		</label>
		<div class="demo-form-actions">
			<button type="submit">{submitting ? 'Création…' : 'Créer le compte et la passkey'}</button>
			{#if allowLogin}<button type="button" onclick={() => currentState.toLogin()}
					>Se connecter</button
				>{/if}
		</div>
	</fieldset>
</form>
