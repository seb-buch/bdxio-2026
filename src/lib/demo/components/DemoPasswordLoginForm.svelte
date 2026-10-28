<script lang="ts">
	import DemoLoginHeading from './DemoLoginHeading.svelte';
	import type { LoginState } from '#lib/demo/logic/common.js';

	type Props = {
		currentState: LoginState;
		submitting?: boolean;
		allowRegistration?: boolean;
	};

	let {
		currentState = $bindable(),
		submitting = $bindable(false),
		allowRegistration = true
	}: Props = $props();

	function startRegistration() {
		currentState.toRegistration();
	}

	async function login(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		try {
			await currentState.login();
		} finally {
			submitting = false;
		}
	}
</script>

<DemoLoginHeading />
<form class="demo-account-form" onsubmit={login}>
	<label>
		Identifiant
		<input
			bind:value={currentState.username}
			autocomplete="username"
			required
			disabled={submitting}
		/>
	</label>
	<label>
		Mot de passe
		<input
			type="password"
			bind:value={currentState.password}
			autocomplete="current-password"
			required
			disabled={submitting}
		/>
	</label>
	<div class="demo-form-actions">
		<button disabled={submitting}>{submitting ? 'Connexion…' : 'Se connecter'}</button>
		{#if allowRegistration}
			<button type="button" onclick={startRegistration} disabled={submitting}
				>Créer un compte</button
			>
		{/if}
	</div>
</form>
