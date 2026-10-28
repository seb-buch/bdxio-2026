<script lang="ts">
	import type { MfaAuthenticationStateManager } from '#lib/demo/logic/mfa-demo.svelte.js';
	import MfaSectionTitle from '#lib/slides/mfa/MfaSectionTitle.svelte';
	import MfaIntroductionSlide from '#lib/slides/mfa/MfaIntroductionSlide.svelte';
	import TotpExplanationSlide from '#lib/slides/mfa/TotpExplanationSlide.svelte';
	import MfaEnrollmentDemoSlide from '#lib/slides/mfa/MfaEnrollmentDemoSlide.svelte';
	import MfaStoredDataSlide from '#lib/slides/mfa/MfaStoredDataSlide.svelte';
	import MfaLimitationsSlide from '#lib/slides/mfa/MfaLimitationsSlide.svelte';

	type Props = {
		authenticationState: MfaAuthenticationStateManager['currentState'];
	};
	let { authenticationState = $bindable() }: Props = $props();
</script>

<MfaSectionTitle />
<MfaIntroductionSlide />
<TotpExplanationSlide />
<MfaEnrollmentDemoSlide bind:authenticationState />
<MfaStoredDataSlide {authenticationState} />
<MfaLimitationsSlide />
