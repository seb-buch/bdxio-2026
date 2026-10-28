<script lang="ts">
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
	import type { SlideChangeDetail } from '@seb-buch/slyd';
	import DemoLoginHeading from './DemoLoginHeading.svelte';
	import type { PasskeyOnlyLoginState } from '#lib/demo/logic/passkey-only-demo.svelte.js';

	type Props = { currentState: PasskeyOnlyLoginState };
	let { currentState = $bindable() }: Props = $props();
	let submitting = $state(false);
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
		if (!active || submitting) return;
		const controller = new AbortController();
		autofillController = controller;
		autofillRequest = currentState.startPasskeyAutofill(controller.signal);
		return () => controller.abort();
	});

	async function toRegistration() {
		if (submitting) return;
		submitting = true;
		autofillController?.abort();
		try {
			await autofillRequest;
			await currentState.toRegistration();
		} finally {
			submitting = false;
		}
	}

	async function login(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		autofillController?.abort();
		try {
			// Let the previous options request settle before replacing its challenge cookie.
			await autofillRequest;
			await currentState.login();
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
			autocomplete="username webauthn"
			required
			disabled={submitting}
		/>
	</label>
	<div class="demo-form-actions">
		<button type="submit" disabled={submitting || !currentState.username}
			>{submitting ? 'Connexion…' : 'Se connecter'}</button
		>
		<button type="button" onclick={toRegistration} disabled={submitting}>Créer un compte</button>
	</div>
</form>
