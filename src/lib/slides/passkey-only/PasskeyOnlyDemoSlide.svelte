<script lang="ts">
	import DemoApplication from '#lib/demo/components/DemoApplication.svelte';
	import { Slide, SpeakerNotes, type SlideChangeDetail } from '@seb-buch/slyd';
	import { onMount, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { PasskeyOnlyAuthenticationStateManager } from '#lib/demo/logic/passkey-only-demo.svelte.js';
	import DemoPasskeyOnlyRegistrationForm from '#lib/demo/components/DemoPasskeyOnlyRegistrationForm.svelte';
	import DemoPasskeyOnlyLoginForm from '#lib/demo/components/DemoPasskeyOnlyLoginForm.svelte';
	import DemoAccountSummary from '#lib/demo/components/DemoAccountSummary.svelte';
	import DemoPasskeyManagement from '#lib/demo/components/DemoPasskeyManagement.svelte';
	let {
		authenticationState = $bindable(),
		phase
	}: {
		authenticationState: PasskeyOnlyAuthenticationStateManager['currentState'];
		phase: 'registration' | 'login';
	} = $props();
	let heading: HTMLHeadingElement;
	let previousIndex: number | undefined;
	let pending = $state(false);
	let message = $state('');
	onMount(() =>
		on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			const slide = heading.closest('.slyd-slide');
			const presentation = heading.closest('.slyd');
			if (!slide || !presentation || event.target !== presentation) return;
			const ownIndex = Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(slide);
			if (event.detail.slideIndex === ownIndex && previousIndex === ownIndex - 1) pending = true;
			previousIndex = event.detail.slideIndex;
		})
	);
	async function prepare() {
		message = '';
		try {
			if (authenticationState.kind === 'authenticated') await authenticationState.logout();
			if (phase === 'registration' && authenticationState.kind === 'user-login')
				await authenticationState.toRegistration();
			if (phase === 'login' && authenticationState.kind === 'user-registration')
				await authenticationState.toLogin();
		} catch {
			message = 'Impossible de préparer la démo. Réessayez depuis le formulaire.';
		}
	}
	$effect(() => {
		if (!pending || authenticationState.kind === 'initial') return;
		pending = false;
		untrack(() => void prepare());
	});
</script>

<Slide>
	<h3 bind:this={heading}>
		100 % passkey &ndash; {phase === 'registration' ? 'Créer un compte' : 'Se connecter'}
	</h3>
	<DemoApplication state={authenticationState}>
		{#if authenticationState.kind === 'authenticated'}<DemoAccountSummary
				currentState={authenticationState}
			/>
			{#if phase === 'login'}<DemoPasskeyManagement />{/if}
		{:else if authenticationState.kind === 'user-registration'}
			<DemoPasskeyOnlyRegistrationForm bind:currentState={authenticationState} />
		{:else if authenticationState.kind === 'user-login'}
			<DemoPasskeyOnlyLoginForm bind:currentState={authenticationState} />
		{:else if authenticationState.kind === 'unavailable'}<p>{authenticationState.message}</p>
		{:else}<p>Chargement…</p>{/if}
	</DemoApplication>
	{#if message}<p role="alert">{message}</p>{/if}
	<SpeakerNotes>
		{#if phase === 'registration'}
			<p>
				Cette fois, je choisis un nouvel identifiant et je renseigne mes informations, mais il n’y a
				aucun champ mot de passe. [Créer le compte et la passkey.] Je valide la création dans le
				gestionnaire proposé par mon appareil.
			</p>
			<p>
				Le compte est créé seulement après la vérification de la réponse WebAuthn. Si j’annule la
				fenêtre, aucun compte définitif n’est enregistré. Regardons cet enregistrement avant de nous
				connecter.
			</p>
		{:else}
			<p>
				Mon compte existe, mais il n’a pas de mot de passe. Le champ Identifiant peut proposer ma
				passkey via l’autocomplétion. Je peux aussi saisir mon identifiant et cliquer sur Se
				connecter. [Choisir le compte créé à l’instant, puis valider localement.]
			</p>
			<p>
				Avec le bouton Se connecter, le serveur limite la demande aux passkeys de l’identifiant
				saisi. Avec l’autocomplétion, il retrouve le compte associé au credential choisi. Dans les
				deux cas, il vérifie la preuve avec la clé publique, comme dans la partie précédente.
			</p>
			<p>
				L’autocomplétion peut aussi proposer les passkeys des comptes précédents, car toutes les
				démos utilisent le même site. Choisir le nouveau compte sans mot de passe pour poursuivre la
				démonstration des données.
			</p>
			<p>
				Une fois connecté, renommer la première passkey « Ordinateur ». Ajouter une passkey nommée «
				Téléphone » en choisissant le téléphone dans la fenêtre système. Vérifier deux identifiants
				distincts. Se déconnecter puis revenir avec le téléphone via le QR code. Retirer ensuite «
				Ordinateur », se déconnecter et tester explicitement cet ancien credential : la connexion
				doit échouer. Revenir avec « Téléphone » avant de poursuivre.
			</p>
		{/if}
	</SpeakerNotes>
</Slide>
