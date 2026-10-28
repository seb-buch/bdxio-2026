<script lang="ts">
	import type { PasswordAuthenticationStateManager } from '#lib/demo/logic/password-demo.svelte.js';
	import PasswordSectionTitle from '#lib/slides/password-only/PasswordSectionTitle.svelte';
	import PasswordDemoAuth from '#lib/slides/password-only/PasswordDemoAuth.svelte';
	import PasswordAttackSlide from '#lib/slides/password-only/PasswordAttackSlide.svelte';
	import PasswordLimitationsSlide from '#lib/slides/password-only/PasswordLimitationsSlide.svelte';

	type Props = {
		authenticationState: PasswordAuthenticationStateManager['currentState'];
	};
	let { authenticationState = $bindable() }: Props = $props();
</script>

<PasswordSectionTitle />
<PasswordDemoAuth bind:authenticationState />
<PasswordAttackSlide {authenticationState} />
<PasswordLimitationsSlide />
