<script lang="ts">
	import DemoAccountSummary from '#lib/demo/components/DemoAccountSummary.svelte';
	import DemoApplication from '#lib/demo/components/DemoApplication.svelte';
	import type { PasskeyMfaAuthenticationStateManager } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';
	import DemoPasswordLoginForm from './DemoPasswordLoginForm.svelte';
	import DemoPasskeyLoginForm from './DemoPasskeyLoginForm.svelte';
	import DemoPasskeyAccountActions from './DemoPasskeyAccountActions.svelte';
	import DemoMfaVerificationForm from './DemoMfaVerificationForm.svelte';
	let {
		authenticationState = $bindable(),
		phase
	}: {
		authenticationState: PasskeyMfaAuthenticationStateManager['currentState'];
		phase: 'registration' | 'login';
	} = $props();
	let submitting = $state(false);
</script>

<DemoApplication state={authenticationState}>
	{#if authenticationState.kind === 'authenticated'}
		<DemoAccountSummary currentState={authenticationState} bind:submitting />
		<DemoPasskeyAccountActions currentState={authenticationState} bind:submitting />
	{:else if authenticationState.kind === 'user-login'}
		{#if phase === 'registration'}
			<DemoPasswordLoginForm bind:currentState={authenticationState} allowRegistration={false} />
		{:else}
			<DemoPasskeyLoginForm bind:currentState={authenticationState} />
		{/if}
	{:else if authenticationState.kind === 'second-factor' || authenticationState.kind === 'otp-enrollment'}
		<DemoMfaVerificationForm bind:currentState={authenticationState} />
	{:else if authenticationState.kind === 'user-registration'}
		<button
			type="button"
			onclick={() =>
				authenticationState.kind === 'user-registration' && authenticationState.toLogin()}
			>Se connecter</button
		>
	{:else if authenticationState.kind === 'unavailable'}<p>{authenticationState.message}</p>
	{:else}<p>Chargement…</p>{/if}
</DemoApplication>
