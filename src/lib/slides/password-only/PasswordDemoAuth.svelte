<script lang="ts">
	import DemoApplication from '#lib/demo/components/DemoApplication.svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import type { PasswordAuthenticationStateManager } from '#lib/demo/logic/password-demo.svelte.js';
	import DemoPasswordLoginForm from '#lib/demo/components/DemoPasswordLoginForm.svelte';
	import DemoPasswordRegistrationForm from '#lib/demo/components/DemoPasswordRegistrationForm.svelte';
	import DemoAccountSummary from '#lib/demo/components/DemoAccountSummary.svelte';

	type Props = {
		authenticationState: PasswordAuthenticationStateManager['currentState'];
	};
	let { authenticationState = $bindable() }: Props = $props();
</script>

<Slide>
	<h3>Authentification par mot de passe</h3>
	<DemoApplication state={authenticationState}>
		{#if authenticationState.kind === 'authenticated'}
			<DemoAccountSummary currentState={authenticationState} />
		{:else if authenticationState.kind === 'user-login'}
			<DemoPasswordLoginForm bind:currentState={authenticationState} />
		{:else if authenticationState.kind === 'user-registration'}
			<DemoPasswordRegistrationForm bind:currentState={authenticationState} />
		{:else if authenticationState.kind === 'unavailable'}
			<p>{authenticationState.message}</p>
		{:else}
			<p>Chargement…</p>
		{/if}
	</DemoApplication>
	<SpeakerNotes>
		<p>
			L'authentification par mot de passe, tout le monde connaît. Quand on arrive sur un nouveau
			site, on va commencer par créer son compte et on nous demande en général un identifiant et
			puis on va demander également le prénom, le nom et on va nous demander de générer ou en tout
			cas de donner un mot de passe pour pouvoir se connecter avec ce compte. Et on va créer le
			compte comme ça. À partir du moment où on a le compte qui est créé, on va pouvoir se connecter
			sur le compte en utilisant notre mot de passe. OK, jusque là, rien d'exceptionnel, c'est je
			pense que tout le monde parmi vous a déjà eu à faire à ce genre d'authentification.
		</p>
	</SpeakerNotes>
</Slide>
