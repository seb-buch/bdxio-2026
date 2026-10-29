<script lang="ts">
	import { DemoError, demoErrorMessage } from '#lib/demo/logic/errors.js';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import { untrack } from 'svelte';
	import { examplePasskeyMfaData } from '#lib/demo/example-data.js';
	import type {
		PasskeyMfaAuthenticationStateManager
	} from '#lib/demo/logic/passkey-mfa-demo.svelte.js';
	import type { PasskeyMfaDemoDataRow } from '#lib/demo/models.js';
	import { BASE_API_URL } from '#lib/demo/constants.js';
	import DemoPasskeyStoredRecord from '#lib/demo/components/DemoPasskeyStoredRecord.svelte';

	let {
		authenticationState
	}: {
		authenticationState: PasskeyMfaAuthenticationStateManager['currentState'];
	} = $props();
	let record = $state<PasskeyMfaDemoDataRow>();
	const displayedRecord = $derived(record ?? examplePasskeyMfaData);
	let message = $state('');
	let loading = $state(false);

	$effect(() => {
		const username =
			authenticationState.kind === 'authenticated' ? authenticationState.user.username : undefined;
		record = undefined;
		message = '';
		loading = false;
		if (!username) return;
		const controller = new AbortController();
		untrack(() => void loadRecord(username, controller.signal));
		return () => controller.abort();
	});

	async function loadRecord(username: string, signal: AbortSignal) {
		loading = true;
		try {
			const response = await fetch(`${BASE_API_URL}/passkey-mfa/data`, {
				cache: 'no-store',
				signal
			});
			const body: PasskeyMfaDemoDataRow & { message?: string } = await response.json();
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
	<h3>Mot de passe, TOTP et passkeys &ndash; données stockées</h3>
	<DemoPasskeyStoredRecord record={displayedRecord} />
	<SpeakerNotes>
		<p>
			On conserve les mêmes données que précédemment : les données utilisateur, l’empreinte du mot
			de passe et les données TOTP. [Credential de la passkey.] On y ajoute le credential enregistré
			pour la passkey, puis on détaille ses champs.
		</p>

		<p>
			[Identifiant.] Cet identifiant permet de retrouver le credential dont on doit vérifier la
			signature. Ce n’est pas un secret.
		</p>
		<p>
			[Clé publique.] Le serveur l’utilise pour vérifier les signatures. La valeur en Base64
			représente les octets de la clé publique, pas une clé privée chiffrée. L’authentification par
			passkey prouve la possession de la clé privée sans la transmettre au serveur.
		</p>
		<p>
			[Compteur.] C’est un compteur de signatures. Son comportement dépend de l’authentificateur ;
			il peut rester à zéro, notamment avec certaines passkeys synchronisées.
		</p>
		<p>
			[Transports.] Ce sont des indications pour le navigateur sur la façon de joindre
			l’authentificateur, par exemple en USB, en NFC ou via un authentificateur intégré.
		</p>
	</SpeakerNotes>
</Slide>
