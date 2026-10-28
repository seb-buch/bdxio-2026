<script lang="ts">
	import { onMount } from 'svelte';
	import { BASE_API_URL } from '#lib/demo/constants.js';
	import { DemoError, demoErrorMessage } from '#lib/demo/logic/errors.js';
	import { PasskeyClient, passkeyError } from '#lib/demo/logic/passkey-client.js';

	const endpoint = `${BASE_API_URL}/passkey-only/credentials`;
	const passkey = new PasskeyClient(endpoint);
	let credentials = $state<{ id: string; label: string }[]>([]);
	let label = $state('Téléphone');
	let busy = $state(false);
	let message = $state('');
	let failed = $state(false);

	onMount(() => {
		void perform(load);
	});

	async function request(method: string, body?: unknown) {
		const response = await fetch(endpoint, {
			method,
			headers: { 'content-type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body),
			cache: 'no-store'
		});
		if (!response.ok) {
			const error = await response.json();
			throw new DemoError(error.message ?? 'La gestion des passkeys a échoué.');
		}
		return response;
	}

	async function load() {
		credentials = await (await request('GET')).json();
	}

	async function perform(action: () => Promise<void>, success = '') {
		if (busy) return;
		busy = true;
		message = '';
		failed = false;
		try {
			await action();
			message = success;
		} catch (cause) {
			failed = true;
			message =
				cause instanceof DemoError
					? demoErrorMessage(cause, 'L’opération a échoué.')
					: passkeyError(cause);
		} finally {
			busy = false;
		}
	}

	async function add(event: SubmitEvent) {
		event.preventDefault();
		await perform(async () => {
			await passkey.register(undefined, label.trim());
			await load();
		}, 'Une autre passkey est enregistrée. Vous pouvez maintenant vous connecter avec elle.');
	}

	async function rename(credential: { id: string; label: string }) {
		await perform(async () => {
			await request('PATCH', credential);
			await load();
		}, 'Nom de la passkey enregistré.');
	}

	async function remove(id: string) {
		await perform(async () => {
			await request('DELETE', { id });
			await load();
		}, 'Passkey retirée du compte. Testez une nouvelle connexion pour vérifier la révocation.');
	}
</script>

<section class="management" aria-label="Mes passkeys">
	<h4>Mes passkeys</h4>
	<table>
		<thead
			><tr
				><th scope="col">Nom</th><th scope="col">ID du credential</th><th scope="col">Actions</th
				></tr
			></thead
		>
		<tbody>
			{#each credentials as credential (credential.id)}
				<tr>
					<td
						><input
							aria-label={`Nom de la passkey ${credential.id.slice(0, 8)}`}
							bind:value={credential.label}
							maxlength="60"
							required
							disabled={busy}
						/></td
					>
					<td><code title={credential.id}>{credential.id.slice(0, 14)}…</code></td>
					<td class="actions">
						<button
							type="button"
							onclick={() => rename(credential)}
							disabled={busy || !credential.label.trim()}>Renommer</button
						>
						<button
							type="button"
							onclick={() => remove(credential.id)}
							disabled={busy || credentials.length <= 1}>Retirer</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<form onsubmit={add}>
		<label
			>Nom de la nouvelle passkey<input
				bind:value={label}
				maxlength="60"
				required
				disabled={busy}
			/></label
		>
		<button type="submit" disabled={busy || !label.trim()}
			>{busy ? 'Opération en cours…' : 'Ajouter une passkey'}</button
		>
	</form>
	<p class="help">Conservez au moins une passkey pour accéder à votre compte.</p>
	{#if message}<p class="result" role={failed ? 'alert' : 'status'}>{message}</p>{/if}
</section>

<style>
	.management {
		border-top: 1px solid var(--atlas-rule);
		margin-top: 22px;
		padding-top: 18px;
		text-align: left;
	}
	h4 {
		margin: 0 0 12px;
		font-size: 28px;
	}
	table {
		font-size: 21px;
		table-layout: fixed;
	}
	th,
	td {
		padding: 8px;
		vertical-align: middle;
	}
	th:first-child {
		width: 27%;
	}
	th:last-child {
		width: 43%;
	}
	input {
		box-sizing: border-box;
		width: 100%;
	}
	.actions {
		display: flex;
		gap: 10px;
	}
	form {
		display: flex;
		gap: 18px;
		align-items: end;
		margin-top: 20px;
	}
	label {
		flex: 1;
		font-size: 21px;
	}
	label input {
		display: block;
		margin-top: 6px;
	}
	button {
		white-space: nowrap;
	}
	.help,
	.result {
		margin: 12px 0 0;
		font-size: 21px;
	}
	.help {
		color: var(--atlas-muted);
	}
</style>
