<script lang="ts">
	import { Slide, SpeakerNotes, type SlideChangeDetail } from '@seb-buch/slyd';
	import { onMount, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import DemoPasskeyApplication from '#lib/demo/components/DemoPasskeyApplication.svelte';
	import type { PasskeyMfaAuthenticationStateManager } from '#lib/demo/logic/passkey-mfa-demo.svelte.js';
	let {
		authenticationState = $bindable(),
		phase
	}: {
		authenticationState: PasskeyMfaAuthenticationStateManager['currentState'];
		phase: 'registration' | 'login';
	} = $props();
	let heading: HTMLHeadingElement;
	let previousIndex: number | undefined;
	let loginPending = $state(false);
	let message = $state('');
	onMount(() =>
		on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			const slide = heading.closest('.slyd-slide');
			const presentation = heading.closest('.slyd');
			if (!slide || !presentation || event.target !== presentation) return;
			const ownIndex = Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(slide);
			if (
				phase === 'login' &&
				event.detail.slideIndex === ownIndex &&
				previousIndex === ownIndex - 1
			)
				loginPending = true;
			previousIndex = event.detail.slideIndex;
		})
	);
	async function prepareLogin() {
		message = '';
		try {
			if (authenticationState.kind === 'authenticated') await authenticationState.logout();
		} catch {
			message = 'La déconnexion a échoué. Réessayez avec le bouton Se déconnecter.';
		}
	}
	$effect(() => {
		if (!loginPending || authenticationState.kind === 'initial') return;
		loginPending = false;
		untrack(() => void prepareLogin());
	});
</script>

<Slide>
	<h3 bind:this={heading}>
		Passkey &ndash; {phase === 'registration' ? 'Ajouter au compte' : 'Se connecter'}
	</h3>
	<DemoPasskeyApplication bind:authenticationState {phase} />
	{#if message}<p role="alert">{message}</p>{/if}
	<SpeakerNotes>
		{#if phase === 'registration'}
			<p>
				Je reprends le compte existant. [Se connecter avec le mot de passe puis un nouveau code
				TOTP.] Je peux maintenant lui ajouter une passkey. Il ne s’agit pas de créer un nouveau
				compte ni de supprimer les méthodes précédentes.
			</p>
			<p>
				[Cliquer sur Ajouter une passkey.] Le navigateur affiche la fenêtre du système ou du
				gestionnaire de passkeys. Je choisis où l’enregistrer, puis je valide avec le mécanisme
				proposé. [Terminer.] La passkey est maintenant associée à mon compte. Regardons ce qui a été
				créé et envoyé au serveur.
			</p>
		{:else}
			<p>
				La passkey est enregistrée. Essayons une nouvelle connexion. Je renseigne mon identifiant,
				puis je choisis Se connecter ou la passkey proposée par le navigateur. [Valider dans la
				fenêtre du système.]
			</p>
			<p>
				Je suis connecté, sans saisir le mot de passe du site ni recopier un code TOTP. Le geste
				local autorise l’utilisation de la clé privée ; ce n’est pas un secret que j’envoie au site.
				Regardons comment le serveur a vérifié cette preuve.
			</p>
			<p>
				Le bouton Utiliser mon mot de passe affiche le parcours mot de passe et TOTP dans le même
				formulaire. Ici, la passkey est une méthode de connexion alternative, pas un troisième
				élément demandé après le code.
			</p>
		{/if}
	</SpeakerNotes>
</Slide>
