<script lang="ts">
	import { DemoError, demoErrorMessage } from '#lib/demo/logic/errors.js';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import { untrack } from 'svelte';
	import { exampleMfaData } from '#lib/demo/example-data.js';
	import type { MfaAuthenticationState } from '#lib/demo/logic/mfa-flow.js';
	import type { MfaDemoDataRow } from '#lib/demo/models.js';
	import { BASE_API_URL } from '#lib/demo/constants.js';

	let { authenticationState }: { authenticationState: MfaAuthenticationState } = $props();
	let record = $state<MfaDemoDataRow>();
	const displayedRecord = $derived(record ?? exampleMfaData);
	let message = $state('');
	let loading = $state(false);
	const accountFields = $derived(
		Object.entries(displayedRecord).filter(([field]) => !field.startsWith('totp_'))
	);
	const userFields = ['user_id', 'username', 'firstname', 'lastname'];
	const periodFormatter = new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23'
	});
	const periodLabel = $derived.by(() => {
		const counter = displayedRecord.totp_last_used_counter;
		if (counter === undefined) return undefined;
		const start = counter * 30_000;
		return periodFormatter.formatRange(new Date(start), new Date(start + 30_000));
	});

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
			const response = await fetch(`${BASE_API_URL}/mfa/data`, { cache: 'no-store', signal });
			const body: MfaDemoDataRow & { message?: string } = await response.json();
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
	<h3>Double authentification &ndash; Les données stockées</h3>
	<div class="stored-data">
		<div class="account-groups">
			<span class="user-label fragment" data-fragment-index="0">Données utilisateur</span>
			<span class="password-label fragment" data-fragment-index="1">Mot de passe</span>
		</div>
		<table
			class="account"
			aria-label="Données utilisateur et empreinte du mot de passe, conservées après activation du TOTP"
		>
			<colgroup>
				{#each accountFields as [field] (field)}
					<col class:password-column={field === 'password_hash'} />
				{/each}
			</colgroup>
			<thead>
				<tr>
					{#each accountFields as [field] (field)}
						<th
							scope="col"
							class:user-field={userFields.includes(field)}
							class:user-start={field === 'user_id'}
							class:user-end={field === 'lastname'}
							class:password={field === 'password_hash'}>{field}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody>
				<tr>
					{#each accountFields as [field, value] (field)}
						<td
							class:user-field={userFields.includes(field)}
							class:user-start={field === 'user_id'}
							class:user-end={field === 'lastname'}
							class:password={field === 'password_hash'}><code>{value}</code></td
						>
					{/each}
				</tr>
			</tbody>
		</table>

		{#if displayedRecord.totp_secret !== undefined}
			<div class="totp-groups">
				<span class="secret-label fragment" data-fragment-index="2"
					>Secret TOTP chiffré (AES-256-GCM)</span
				>
				<span class="counter-label fragment" data-fragment-index="3">Dernière période utilisée</span
				>
			</div>
			<table class="totp" aria-label="Données ajoutées par le deuxième facteur TOTP">
				<colgroup>
					<col class="secret-column" />
					<col />
				</colgroup>
				<thead>
					<tr>
						<th scope="col" class="secret">totp_secret</th>
						<th scope="col" class="counter">totp_last_used_counter</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="secret"><code>{displayedRecord.totp_secret}</code></td>
						<td class="counter">
							<code>{displayedRecord.totp_last_used_counter}</code>
							{#if periodLabel}
								<span
									class="counter-period fragment"
									data-fragment-index="3"
									title="Heure locale du navigateur ; fin de période exclue">{periodLabel}</span
								>
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
			<div class="totp-explanations">
				<div class="secret-explanation fragment" data-fragment-index="2">
					<p>Clé secrète conservée côté serveur, hors de la base de données</p>
				</div>
				<p class="counter-explanation fragment" data-fragment-index="3">
					Un code validé par période
				</p>
			</div>
		{:else}
			<p class="hint">Activez la double authentification pour afficher les données TOTP.</p>
		{/if}
	</div>

	<SpeakerNotes>
		<p>
			Regardons ce qui a changé en base depuis l’activation du deuxième facteur. [Données
			utilisateur.] L’identifiant, le nom et le prénom sont toujours là : c’est le même compte. [Mot
			de passe.] Son empreinte est toujours présente aussi. Le TOTP vient compléter
			l’authentification par mot de passe, il ne la remplace pas.
		</p>
		<p>
			Dans le champ Argon2id, nous avions l’algorithme, sa version, les paramètres, le sel et
			l’empreinte. Avec ces informations et un mot de passe candidat, on peut refaire le calcul et
			comparer. Aucune clé de déchiffrement n’est nécessaire, car ce n’est pas du chiffrement. Cela
			ne permet pas de récupérer directement le mot de passe : il faut tester des candidats, comme
			dans notre démonstration précédente.
		</p>
		<p>
			[Secret TOTP.] Ici, deux champs s’ajoutent. Le premier contient le secret TOTP chiffré,
			exactement tel qu’il est stocké en base. Pour calculer les codes attendus, le serveur doit
			pouvoir retrouver le secret original : une empreinte irréversible ne conviendrait pas.
		</p>
		<p>
			Dans cette application, on utilise AES-256-GCM. La clé de chiffrement est différente du secret
			TOTP : elle est générée aléatoirement côté serveur, puis conservée dans un fichier séparé de
			la base et réutilisée. La valeur en base contient l’IV, le tag d’authentification et le secret
			chiffré, encodés en Base64, mais pas la clé. Cette valeur seule ne suffit donc pas à retrouver
			le secret TOTP. Le serveur utilise sa clé pour le déchiffrer au moment de vérifier un code.
		</p>
		<p>
			[Compteur.] Le deuxième champ mémorise la dernière période temporelle acceptée. Ce n’est pas
			le code à six chiffres ni un compteur d’échecs : il permet de refuser le rejeu d’un code déjà
			utilisé. L’annotation traduit ce compteur en une période de trente secondes, affichée en heure
			locale : compteur multiplié par trente pour le début en secondes Unix, puis trente secondes de
			plus pour la fin, qui est exclue.
		</p>
		<p>
			Il faut donc distinguer le vol de la base seule du vol de la base et de la clé de chiffrement.
			Dans le second cas, l’attaquant peut retrouver les secrets TOTP et reproduire les codes. Le
			chiffrement protège le stockage à condition de protéger aussi cette clé.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.stored-data {
		margin-top: 60px;
	}

	.account-groups,
	.totp-groups,
	.totp-explanations {
		display: grid;
		gap: 24px;
	}

	.account-groups {
		grid-template-columns: 3fr 2fr;
	}

	.totp-groups,
	.totp-explanations {
		grid-template-columns: 3fr 1fr;
	}

	.account-groups,
	.totp-groups {
		margin-bottom: 12px;
		font-size: 32px;
		font-weight: 600;
	}

	.totp-groups {
		margin-top: 48px;
	}

	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		text-align: left;
		font-size: 24px;
	}

	.password-column {
		width: 40%;
	}

	.secret-column {
		width: 75%;
	}

	th,
	td {
		padding: 20px 24px;
		border: 1px solid #d3dce8;
		vertical-align: top;
		overflow-wrap: anywhere;
	}

	th {
		background: #e8edf3;
		font-family: monospace;
		font-weight: 600;
	}

	td {
		background: white;
	}

	.totp-explanations {
		margin: 20px 0 0;
		font-size: 28px;
	}

	.totp-explanations p {
		margin: 0 0 10px;
	}

	.user-label {
		color: #214ed3;
	}

	.password-label {
		color: #7950a3;
	}

	.secret-label,
	.secret-explanation {
		color: #126d70;
	}

	.counter-label,
	.counter-explanation {
		color: #95600c;
	}

	.counter-period {
		display: block;
		margin-top: 12px;
		font-size: 24px;
		color: #95600c;
	}

	.stored-data:has(.user-label:global(.revealed)) th.user-field {
		border-top: 5px solid #214ed3;
	}

	.stored-data:has(.user-label:global(.revealed)) td.user-field {
		border-bottom: 5px solid #214ed3;
	}

	.stored-data:has(.user-label:global(.revealed)) .user-start {
		border-left: 5px solid #214ed3;
	}

	.stored-data:has(.user-label:global(.revealed)) .user-end {
		border-right: 5px solid #214ed3;
	}

	.stored-data:has(.password-label:global(.revealed)) th.password {
		border-top: 5px solid #7950a3;
	}

	.stored-data:has(.password-label:global(.revealed)) td.password {
		border-bottom: 5px solid #7950a3;
	}

	.stored-data:has(.password-label:global(.revealed)) .password {
		border-left: 5px solid #7950a3;
		border-right: 5px solid #7950a3;
	}

	.stored-data:has(.secret-label:global(.revealed)) th.secret {
		border-top: 5px solid #126d70;
	}

	.stored-data:has(.secret-label:global(.revealed)) td.secret {
		border-bottom: 5px solid #126d70;
	}

	.stored-data:has(.secret-label:global(.revealed)) .secret {
		border-left: 5px solid #126d70;
		border-right: 5px solid #126d70;
	}

	.stored-data:has(.counter-label:global(.revealed)) th.counter {
		border-top: 5px solid #95600c;
	}

	.stored-data:has(.counter-label:global(.revealed)) td.counter {
		border-bottom: 5px solid #95600c;
	}

	.stored-data:has(.counter-label:global(.revealed)) .counter {
		border-left: 5px solid #95600c;
		border-right: 5px solid #95600c;
	}

	.hint {
		font-size: 28px;
		color: #617087;
	}
</style>
