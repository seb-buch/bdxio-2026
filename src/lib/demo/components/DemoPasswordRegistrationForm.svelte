<script lang="ts">
	import type { RegistrationState } from '#lib/demo/logic/common.js';
	import { passwordPolicyError } from '#lib/demo/logic/password-policy.js';

	type Props = {
		currentState: RegistrationState;
		allowLogin?: boolean;
	};

	const { currentState = $bindable(), allowLogin = true }: Props = $props();
	let submitting = $state(false);
	const passwordHelpId = $props.id();
	const passwordError = $derived(passwordPolicyError(currentState.password));

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting || passwordError) return;
		submitting = true;
		try {
			await currentState.register();
		} finally {
			submitting = false;
		}
	}

	function back() {
		currentState.toLogin();
	}
</script>

<p class="demo-form-title">Créer votre compte</p>
<form class="demo-account-form" onsubmit={submit}>
	<fieldset disabled={submitting}>
		<legend>Informations du compte</legend>
		<label>
			Identifiant
			<input bind:value={currentState.username} autocomplete="username" required />
		</label>
		<div class="demo-name-fields">
			<label>
				Prénom
				<input bind:value={currentState.firstname} autocomplete="given-name" required />
			</label>
			<label>
				Nom
				<input bind:value={currentState.lastname} autocomplete="family-name" required />
			</label>
		</div>
		<label>
			Mot de passe
			<input
				type="password"
				bind:value={currentState.password}
				autocomplete="new-password"
				aria-describedby={passwordHelpId}
				aria-invalid={currentState.password.length > 0 && !!passwordError}
				required
			/>
			<small
				id={passwordHelpId}
				class:valid={!passwordError}
				class:invalid={currentState.password.length > 0 && !!passwordError}
				>{passwordError ?? 'Ce mot de passe respecte les règles.'}</small
			>
		</label>
		<div class="demo-form-actions">
			<button type="submit" disabled={!!passwordError}
				>{submitting ? 'Création du compte…' : 'Créer le compte'}</button
			>
			{#if allowLogin}<button type="button" onclick={back}>Se connecter</button>{/if}
		</div>
	</fieldset>
</form>

<style>
	small {
		color: #617087;
		font-size: 22px;
		font-weight: 400;
	}
	small.valid {
		color: #187353;
	}
	small.invalid {
		color: #a02b36;
	}
</style>
