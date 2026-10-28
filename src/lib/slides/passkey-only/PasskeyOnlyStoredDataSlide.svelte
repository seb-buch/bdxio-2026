<script lang="ts">
	import { DemoError, demoErrorMessage } from '#lib/demo/logic/errors.js';
	import { Slide, type SlideChangeDetail, SpeakerNotes } from '@seb-buch/slyd';
	import { onMount, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { examplePasskeyOnlyData } from '#lib/demo/example-data.js';
	import type {
		PasskeyOnlyAuthenticationStateManager
	} from '#lib/demo/logic/passkey-only-demo.svelte.js';
	import type { PasskeyOnlyDemoDataRow } from '#lib/demo/models.js';
	import { BASE_API_URL } from '#lib/demo/constants.js';
	import DemoPasskeyTransports from '#lib/demo/components/DemoPasskeyTransports.svelte';

	let {
		authenticationState,
		credentialsRevision = 0
	}: {
		authenticationState: PasskeyOnlyAuthenticationStateManager['currentState'];
		credentialsRevision?: number;
	} = $props();
	let record = $state<PasskeyOnlyDemoDataRow>();
	let message = $state('');
	let loading = $state(false);
	let heading: HTMLHeadingElement;
	let active = $state(false);
	let refresh = $state(0);

	onMount(() => {
		const slide = heading.closest('.slyd-slide');
		const presentation = slide?.closest('.slyd');
		if (!slide || !presentation) return;
		const ownIndex = Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(slide);
		active = slide.classList.contains('current');
		return on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			if (event.target === presentation) active = event.detail.slideIndex === ownIndex;
		});
	});

	$effect(() => {
		const username =
			authenticationState.kind === 'authenticated' ? authenticationState.user.username : undefined;
		// Reload on slide entry and after any credential mutation, even for the same account.
		void credentialsRevision;
		void refresh;
		record = undefined;
		message = '';
		loading = false;
		if (!active || !username) return;
		const controller = new AbortController();
		untrack(() => void loadRecord(username, controller.signal));
		return () => controller.abort();
	});

	async function loadRecord(username: string, signal: AbortSignal) {
		loading = true;
		try {
			const response = await fetch(`${BASE_API_URL}/passkey-only/data`, {
				cache: 'no-store',
				signal
			});
			const body: PasskeyOnlyDemoDataRow & { message?: string } = await response.json();
			if (signal.aborted) return;
			if (!response.ok)
				throw new DemoError(
					response.status < 500 && body.message
						? body.message
						: 'Impossible de charger les données.'
				);
			if (body.username !== username)
				throw new DemoError('Les données ne correspondent pas au compte connecté.');
			record = body;
		} catch (cause) {
			if (!signal.aborted) {
				console.error('Demo data loading failed:', cause);
				message = demoErrorMessage(cause, 'Impossible de charger les données du compte.');
			}
		} finally {
			if (!signal.aborted) loading = false;
		}
	}
</script>

<Slide>
	<h3 bind:this={heading}>Passkeys seules – Les données stockées</h3>
	{#if authenticationState.kind === 'authenticated'}
		{#if message}
			<p role="alert">{message}</p>
			<button type="button" onclick={() => refresh++}>Réessayer</button>
		{:else if loading || !record}
			<p role="status">Chargement des passkeys du compte…</p>
		{:else}
			<DemoPasskeyTransports {record} />
		{/if}
	{:else}
		<p>Données d’exemple — connectez-vous dans la démo pour afficher celles de votre compte.</p>
		<DemoPasskeyTransports record={examplePasskeyOnlyData} />
	{/if}
	<SpeakerNotes>
		<p>
			Toutes les passkeys du compte sont affichées en entier, avec leur identifiant, leur nom, leur
			clé publique, leur compteur et leurs transports. Comparer directement la passkey de
			l’ordinateur et celle du téléphone. Les identifiants et les clés publiques sont propres à
			chaque credential. Les données utilisateur ont déjà été présentées.
		</p>
		<p>
			[Après la comparaison, test facultatif de révocation.] Revenir à la gestion des passkeys,
			retirer « Ordinateur », puis se déconnecter et tester explicitement cet ancien credential : la
			connexion doit échouer. Revenir avec « Téléphone ». En retournant sur cette diapositive, seule
			la passkey restante doit apparaître.
		</p>

		<p>
			[Transports.] La liste décrit les façons possibles de joindre l’authentificateur ; elle
			n’indique pas le transport utilisé lors de la dernière connexion. « internal » correspond à un
			usage local : par exemple, se connecter depuis le navigateur du téléphone avec sa passkey. «
			hybrid » permet de se connecter sur l’ordinateur en utilisant le téléphone. La présence des
			deux valeurs annonce ces deux possibilités d’accès à la même passkey.
		</p>
		<p>
			Ces indications sont renvoyées par le navigateur lors de l’enregistrement puis conservées par
			le serveur. Elles ne prouvent ni l’emplacement exclusif de la clé ni sa synchronisation. Ne
			pas confondre le transport « hybrid » avec le parcours mot de passe + passkey présenté
			précédemment.
		</p>
		<p>
			[Spécification.] Les six transports affichés sont ceux du Level 4, dernier brouillon publié le
			15 septembre 2026. USB, NFC et BLE décrivent des liaisons ; smart-card désigne une carte à
			contacts ISO 7816. Le transport hybrid combine des mécanismes de communication et de
			proximité. Il figure depuis le Level 3 ; il était absent du Level 2.
		</p>
		<p>
			Avec internal seul, le navigateur n’a annoncé que l’accès local. Ne pas en déduire que la clé
			ne peut jamais être synchronisée ou que d’autres accès seront impossibles à l’avenir. L’ordre
			renvoyé par getTransports() est lexicographique, sans priorité.
		</p>
	</SpeakerNotes>
</Slide>
