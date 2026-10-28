<script lang="ts">
	import type { PasskeyAuthenticatedState } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';

	type Props = { currentState: PasskeyAuthenticatedState; submitting?: boolean };
	let { currentState, submitting = $bindable(false) }: Props = $props();

	async function registerPasskey() {
		if (submitting) return;
		submitting = true;
		try {
			await currentState.registerPasskey();
		} finally {
			submitting = false;
		}
	}
</script>

{#if currentState.passkeyEnabled}
	<p class="demo-auth-status">Une passkey est enregistrée sur votre compte.</p>
{/if}
<button onclick={registerPasskey} disabled={submitting}>
	{submitting
		? 'Veuillez patienter…'
		: currentState.passkeyEnabled
			? 'Ajouter une autre passkey'
			: 'Ajouter une passkey'}
</button>
