<script lang="ts">
	import type { PasskeyOnlyAuthenticationStateManager } from '#lib/demo/logic/passkey-only-demo.svelte.js';
	import PasskeyOnlySectionTitle from '#lib/slides/passkey-only/PasskeyOnlySectionTitle.svelte';
	import PasskeyOnlyIntroductionSlide from '#lib/slides/passkey-only/PasskeyOnlyIntroductionSlide.svelte';
	import PasskeyOnlyDemoSlide from '#lib/slides/passkey-only/PasskeyOnlyDemoSlide.svelte';
	import PasskeyOnlyRegistrationFlowSlide from '#lib/slides/passkey-only/PasskeyOnlyRegistrationFlowSlide.svelte';
	import CrossDeviceSlide from '#lib/slides/passkey-only/CrossDeviceSlide.svelte';
	import PasskeyOnlyStoredDataSlide from '#lib/slides/passkey-only/PasskeyOnlyStoredDataSlide.svelte';
	import PasskeyTypes from '#lib/slides/conclusion/PasskeyTypes.svelte';
	import PasskeyOnlyRecoverySlide from '#lib/slides/passkey-only/PasskeyOnlyRecoverySlide.svelte';

	type Props = {
		authenticationState: PasskeyOnlyAuthenticationStateManager['currentState'];
	};
	let { authenticationState = $bindable() }: Props = $props();
</script>

<PasskeyOnlySectionTitle />
<PasskeyOnlyIntroductionSlide />
<PasskeyOnlyDemoSlide phase="registration" bind:authenticationState />
<PasskeyOnlyRegistrationFlowSlide />
<PasskeyOnlyDemoSlide phase="login" bind:authenticationState />
<CrossDeviceSlide />
<PasskeyOnlyStoredDataSlide {authenticationState} />
<PasskeyTypes />
<PasskeyOnlyRecoverySlide />
