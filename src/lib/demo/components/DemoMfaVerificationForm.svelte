<script lang="ts">
	import type { OtpEnrollmentState, SecondFactorState } from '#lib/demo/logic/mfa-demo.svelte.js';

	type Props = {
		currentState: SecondFactorState | OtpEnrollmentState;
	};

	const { currentState = $bindable() }: Props = $props();
	let submitting = $state(false);

	async function verify(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		try {
			await currentState.verify();
		} finally {
			submitting = false;
		}
	}

	async function cancel() {
		if (submitting) return;
		submitting = true;
		try {
			await currentState.cancel();
		} finally {
			submitting = false;
		}
	}
</script>

<div class="verification" class:enrolling={currentState.kind === 'otp-enrollment'}>
	{#if currentState.kind === 'otp-enrollment'}
		<figure>
			<img
				src={currentState.qrCodeDataUrl}
				alt="QR code à scanner avec votre application d’authentification"
				width="320"
				height="320"
			/>
			<figcaption>BDX I/O 2026 démo · {currentState.username}</figcaption>
		</figure>
	{/if}
	<div>
		{#if currentState.kind === 'otp-enrollment'}
			<p class="demo-form-title">Associer votre application</p>
			<details>
				<summary>Clé de configuration manuelle</summary>
				<code class="secret">{currentState.secret}</code>
			</details>
		{:else}
			<p class="demo-form-title">Confirmez votre connexion</p>
		{/if}
		<form class="demo-account-form" onsubmit={verify}>
			<fieldset disabled={submitting}>
				<legend>Code de l’application d’authentification</legend>
				<label>
					Code à six chiffres
					<input
						bind:value={currentState.code}
						inputmode="numeric"
						autocomplete="one-time-code"
						pattern={'[0-9]{6}'}
						maxlength="6"
						required
					/>
				</label>
				<div class="demo-form-actions">
					<button type="submit"
						>{submitting
							? 'Vérification…'
							: currentState.kind === 'otp-enrollment'
								? 'Confirmer l’activation'
								: 'Se connecter'}</button
					>
					<button type="button" onclick={cancel}>Annuler</button>
				</div>
			</fieldset>
		</form>
	</div>
</div>

<style>
	.verification.enrolling {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr);
		gap: 32px;
		align-items: center;
	}
	figure {
		margin: 0;
	}
	img {
		display: block;
		max-width: 100%;
		height: auto;
	}
	figcaption {
		font-size: 0.75em;
	}
	.secret {
		overflow-wrap: anywhere;
	}
	details {
		margin-bottom: 20px;
		font-size: 22px;
	}
	input,
	button {
		font: inherit;
	}
	input {
		width: 8ch;
		letter-spacing: 0.1em;
	}
</style>
