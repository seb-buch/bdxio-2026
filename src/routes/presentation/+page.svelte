<script lang="ts">
	import { Presentation, type SlideChangeDetail } from '@seb-buch/slyd';
	import { dev } from '$app/env';
	import { BASE_API_URL } from '#lib/demo/constants.js';
	import { on } from 'svelte/events';

	import '#lib/themes/atlas.css';
	import { PasswordAuthenticationStateManager } from '#lib/demo/logic/password-demo.svelte.js';
	import { MfaAuthenticationStateManager } from '#lib/demo/logic/mfa-demo.svelte.js';
	import { PasskeyMfaAuthenticationStateManager } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';
	import { PasskeyOnlyAuthenticationStateManager } from '#lib/demo/logic/passkey-only-demo.svelte.js';
	import { onMount } from 'svelte';
	import IntroductionSection from '#lib/sections/IntroductionSection.svelte';
	import PasswordSection from '#lib/sections/PasswordSection.svelte';
	import MfaSection from '#lib/sections/MfaSection.svelte';
	import PasskeySection from '#lib/sections/PasskeySection.svelte';
	import PasskeyOnlySection from '#lib/sections/PasskeyOnlySection.svelte';
	import ConclusionSection from '#lib/sections/ConclusionSection.svelte';

	const passwordDemoStateManager = new PasswordAuthenticationStateManager();
	const mfaDemoStateManager = new MfaAuthenticationStateManager();
	const passkeyMfaDemoStateManager = new PasskeyMfaAuthenticationStateManager();
	const passkeyOnlyDemoStateManager = new PasskeyOnlyAuthenticationStateManager();

	let startupError = $state('');

	async function initializeDemos(reset: boolean) {
		if (dev && reset) {
			const response = await fetch(`${BASE_API_URL}/reset`, {
				method: 'POST',
				credentials: 'same-origin'
			});
			if (!response.ok) throw new Error('Impossible de réinitialiser les données.');
		}
		if (passwordDemoStateManager.currentState.kind === 'initial') {
			await passwordDemoStateManager.currentState.initialize();
		}
		if (mfaDemoStateManager.currentState.kind === 'initial') {
			await mfaDemoStateManager.currentState.initialize();
		}
		if (passkeyMfaDemoStateManager.currentState.kind === 'initial') {
			await passkeyMfaDemoStateManager.currentState.initialize();
		}
		if (passkeyOnlyDemoStateManager.currentState.kind === 'initial') {
			await passkeyOnlyDemoStateManager.currentState.initialize();
		}
	}

	onMount(() => {
		let started = false;

		function start(slideIndex: number) {
			if (started) return;
			started = true;
			void initializeDemos(slideIndex === 0).catch(() => {
				startupError =
					'L’initialisation des démos a échoué. Rechargez la présentation pour réessayer.';
			});
		}

		const unsubscribe = on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			start(event.detail.slideIndex);
		});
		// Slyd may have selected its initial slide before this parent's onMount.
		const current = document.querySelector('.slyd .slyd-slide.current');
		const presentation = current?.closest('.slyd');
		if (current && presentation) {
			start(Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(current));
		}
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Passkeys &ndash; Sébastien Buchoux</title>
</svelte:head>

{#if startupError}<p class="startup-error" role="alert">{startupError}</p>{/if}

<Presentation>
	<IntroductionSection />
	<PasswordSection bind:authenticationState={passwordDemoStateManager.currentState} />
	<MfaSection bind:authenticationState={mfaDemoStateManager.currentState} />
	<PasskeySection
		bind:authenticationState={passkeyMfaDemoStateManager.currentState}
		lastRegistration={passkeyMfaDemoStateManager.lastRegistration}
		lastAuthentication={passkeyMfaDemoStateManager.lastAuthentication}
	/>
	<PasskeyOnlySection bind:authenticationState={passkeyOnlyDemoStateManager.currentState} />
	<ConclusionSection />
</Presentation>

<style>
	.startup-error {
		position: fixed;
		bottom: 20px;
		left: 20px;
		right: 20px;
		z-index: 100;
		padding: 16px 24px;
		background: #fff;
		border: 1px solid #a02b36;
		color: #a02b36;
		font-size: 20px;
	}
</style>
