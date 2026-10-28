<script lang="ts">
	import type { PasskeyMfaAuthenticationStateManager } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';
	import PasskeySectionTitle from '#lib/slides/passkey-password/PasskeySectionTitle.svelte';
	import AsymmetricKeysSlide from '#lib/slides/passkey-password/AsymmetricKeysSlide.svelte';
	import AsymmetricSigningSlide from '#lib/slides/passkey-password/AsymmetricSigningSlide.svelte';
	import Fido2Slide from '#lib/slides/passkey-password/Fido2Slide.svelte';
	import PasskeyDefinitionSlide from '#lib/slides/passkey-password/PasskeyDefinitionSlide.svelte';
	import PasskeyDiscoverabilitySlide from '#lib/slides/passkey-password/PasskeyDiscoverabilitySlide.svelte';
	import PasskeyOptionsSlide from '#lib/slides/passkey-password/PasskeyOptionsSlide.svelte';
	import PasskeyDemoSlide from '#lib/slides/passkey-password/PasskeyDemoSlide.svelte';
	import PasskeyRegistrationImplementationSlides from '#lib/slides/passkey-password/PasskeyRegistrationImplementationSlides.svelte';
	import PasskeyAuthenticationImplementationSlides from '#lib/slides/passkey-password/PasskeyAuthenticationImplementationSlides.svelte';
	import PasskeyStoredDataSlide from '#lib/slides/passkey-password/PasskeyStoredDataSlide.svelte';
	import PasskeyConclusionSlide from '#lib/slides/passkey-password/PasskeyConclusionSlide.svelte';

	type Props = {
		authenticationState: PasskeyMfaAuthenticationStateManager['currentState'];
		lastRegistration?: PasskeyMfaAuthenticationStateManager['lastRegistration'];
		lastAuthentication?: PasskeyMfaAuthenticationStateManager['lastAuthentication'];
	};
	let { authenticationState = $bindable(), lastRegistration, lastAuthentication }: Props = $props();
</script>

<PasskeySectionTitle />
<AsymmetricKeysSlide />
<AsymmetricSigningSlide />
<Fido2Slide />
<PasskeyDefinitionSlide />
<PasskeyDiscoverabilitySlide />
<PasskeyOptionsSlide />
<PasskeyDemoSlide phase="registration" bind:authenticationState />
<PasskeyRegistrationImplementationSlides exchange={lastRegistration} />
<PasskeyDemoSlide phase="login" bind:authenticationState />
<PasskeyAuthenticationImplementationSlides exchange={lastAuthentication} />
<PasskeyStoredDataSlide {authenticationState} />
<PasskeyConclusionSlide />
