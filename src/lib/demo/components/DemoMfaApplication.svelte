<script lang="ts">
	import DemoAccountSummary from '#lib/demo/components/DemoAccountSummary.svelte';
	import DemoApplication from '#lib/demo/components/DemoApplication.svelte';
	import type { MfaAuthenticationState } from '#lib/demo/logic/mfa-flow.js';
	import DemoPasswordLoginForm from './DemoPasswordLoginForm.svelte';
	import DemoMfaAccountActions from './DemoMfaAccountActions.svelte';
	import DemoMfaVerificationForm from './DemoMfaVerificationForm.svelte';

	let { authenticationState = $bindable() }: { authenticationState: MfaAuthenticationState } =
		$props();
	let submitting = $state(false);
</script>

<DemoApplication state={authenticationState}>
	{#if authenticationState.kind === 'authenticated'}
		<DemoAccountSummary currentState={authenticationState} bind:submitting />
		<DemoMfaAccountActions currentState={authenticationState} bind:submitting />
	{:else if authenticationState.kind === 'second-factor' || authenticationState.kind === 'otp-enrollment'}
		<DemoMfaVerificationForm bind:currentState={authenticationState} />
	{:else if authenticationState.kind === 'user-login'}
		<DemoPasswordLoginForm bind:currentState={authenticationState} allowRegistration={false} />
	{:else if authenticationState.kind === 'unavailable'}
		<p>{authenticationState.message}</p>
	{:else if authenticationState.kind === 'user-registration'}
		<button
			type="button"
			onclick={() =>
				authenticationState.kind === 'user-registration' && authenticationState.toLogin()}
			>Se connecter</button
		>
	{:else}
		<p>Chargement…</p>
	{/if}
</DemoApplication>
