<script lang="ts">
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
	import type { SlideChangeDetail } from '@seb-buch/slyd';
	import DemoLoginHeading from './DemoLoginHeading.svelte';
	import type { PasskeyLoginState } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';

	type Props = { currentState: PasskeyLoginState };
	let { currentState = $bindable() }: Props = $props();
	let submitting = $state(false);
	let mode = $state<'passkey' | 'password'>('passkey');
	let form: HTMLFormElement;
	let active = $state(false);
	let autofillController: AbortController | undefined;
	let autofillRequest: Promise<void> | undefined;

	onMount(() => {
		const slide = form.closest('.slyd-slide');
		const presentation = slide?.closest('.slyd');
		if (!slide || !presentation) return;
		const ownIndex = Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(slide);
		active = slide.classList.contains('current');
		return on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			if (event.target === presentation) active = event.detail.slideIndex === ownIndex;
		});
	});

	$effect(() => {
		if (!active || mode !== 'passkey' || submitting) return;
		const controller = new AbortController();
		autofillController = controller;
		autofillRequest = currentState.startPasskeyAutofill(controller.signal);
		return () => controller.abort();
	});

	function switchMode() {
		currentState.password = '';
		currentState.message = undefined;
		mode = mode === 'passkey' ? 'password' : 'passkey';
	}

	async function login(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		autofillController?.abort();
		try {
			// Let the previous options request settle before replacing its challenge cookie.
			await autofillRequest;
			if (mode === 'passkey') await currentState.loginWithPasskey();
			else await currentState.login();
		} finally {
			submitting = false;
		}
	}
</script>

<DemoLoginHeading />
<form bind:this={form} class="demo-account-form" onsubmit={login}>
	<label>
		Identifiant
		<input
			name="username"
			bind:value={currentState.username}
			autocomplete={mode === 'passkey' ? 'username webauthn' : 'username'}
			required
			disabled={submitting}
		/>
	</label>
	{#if mode === 'password'}
		<label>
			Mot de passe
			<input
				type="password"
				name="password"
				bind:value={currentState.password}
				autocomplete="current-password"
				required
				disabled={submitting}
			/>
		</label>
	{/if}
	<div class="demo-form-actions">
		<button type="submit" disabled={submitting || !currentState.username}
			>{submitting ? 'Connexion…' : 'Se connecter'}</button
		>
		<button type="button" onclick={switchMode} disabled={submitting}
			>{mode === 'passkey' ? 'Utiliser mon mot de passe' : 'Utiliser ma passkey'}</button
		>
	</div>
</form>
