<script lang="ts">
	import type { MfaAuthenticationStateManager } from '#lib/demo/logic/mfa-demo.svelte.js';

	type Props = {
		currentState: Extract<MfaAuthenticationStateManager['currentState'], { kind: 'authenticated' }>;
		submitting?: boolean;
	};
	let { currentState, submitting = $bindable(false) }: Props = $props();

	async function activateMfa() {
		const activate = currentState.activateMfa;
		if (submitting || !activate) return;
		submitting = true;
		try {
			await activate();
		} finally {
			submitting = false;
		}
	}
</script>

{#if currentState.mfaEnabled}
	<p class="demo-auth-status">Double authentification activée</p>
{:else}
	<button onclick={activateMfa} disabled={submitting}>Activer la double authentification</button>
{/if}

<style>
	button {
		margin-top: 1em;
	}
</style>
