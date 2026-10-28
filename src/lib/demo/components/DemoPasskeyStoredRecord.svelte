<script lang="ts">
	import type { PasskeyMfaDemoDataRow } from '#lib/demo/models.js';

	let { record }: { record: PasskeyMfaDemoDataRow } = $props();
	let selectedId = $state('');
	const credentials = $derived(record.passkeys_credentials ?? []);
	const credential = $derived(credentials.find(({ id }) => id === selectedId) ?? credentials[0]);
</script>

<div class="stored-record">
	<h4>Les mêmes que précédemment (Données utilisateur, hash, secret TOTP)</h4>
	<h4>+</h4>
	<h4>Credential de la passkey</h4>
	<section class="fragment" data-fragment-index="0">
		{#if credentials.length > 1}
			<label
				>Passkey à afficher
				<select bind:value={() => credential?.id ?? '', (value) => (selectedId = value)}>
					{#each credentials as item (item.id)}
						<option value={item.id}>{item.label}</option>
					{/each}
				</select>
			</label>
		{/if}
		{#if credential}
			<table aria-label="Credential de passkey enregistré en base">
				<tbody>
					{#each Object.entries(credential) as [field, value] (field)}
						<tr class={field}>
							<th scope="row">{field}</th>
							<td><code>{value}</code></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Ajoutez une passkey pour afficher son credential.</p>
		{/if}
	</section>

	{#if credential}
		<dl class="legend" aria-label="Explication des champs du credential">
			<div class="id-label fragment" data-fragment-index="1">
				<dt>Identifiant</dt>
				<dd>Identifie le credential.</dd>
			</div>
			<div class="key-label fragment" data-fragment-index="2">
				<dt>Clé publique</dt>
				<dd>Utilisée pour vérifier les signatures.</dd>
			</div>
			<div class="counter-label fragment" data-fragment-index="3">
				<dt>Compteur de signatures</dt>
				<dd>Aide à détecter un éventuel clonage</dd>
			</div>
			<div class="transports-label fragment" data-fragment-index="4">
				<dt>Transports</dt>
				<dd>Comment joindre l’authentificateur.</dd>
			</div>
		</dl>
	{/if}
</div>

<style>
	.stored-record {
		margin-top: 36px;
		text-align: left;
	}

	section {
		min-width: 0;
	}

	h4 {
		font-size: 1.3em;
		margin-top: 1em;
		text-align: center;
	}

	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		font-size: 23px;
		margin-top: 1em;
	}

	th,
	td {
		padding: 10px 14px;
		border: 1px solid #d3dce8;
		overflow-wrap: anywhere;
		vertical-align: top;
	}

	th {
		background: #e8edf3;
		font-family: monospace;
		font-weight: 600;
	}

	th[scope='row'] {
		width: 30%;
	}

	td {
		background: #fff;
	}

	label {
		display: block;
		margin-bottom: 12px;
	}

	select {
		margin-left: 12px;
		font-size: 0.6em;
	}

	.legend {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 28px;
		margin: 28px 0;
		font-size: 26px;
	}

	.legend dt {
		font-size: 1.2em;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.legend dd {
		margin: 0;
		font-size: 1em;
	}

	.id-label {
		color: #214ed3;
	}

	.key-label {
		color: #126d70;
	}

	.counter-label {
		color: #95600c;
	}

	.transports-label {
		color: #a52e53;
	}

	.stored-record:has(.id-label:global(.revealed)) .id {
		--field-color: #214ed3;
	}

	.stored-record:has(.key-label:global(.revealed)) .public_key {
		--field-color: #126d70;
	}

	.stored-record:has(.counter-label:global(.revealed)) .counter {
		--field-color: #95600c;
	}

	.stored-record:has(.transports-label:global(.revealed)) .transports {
		--field-color: #a52e53;
	}

	.id td,
	.public_key td,
	.counter td,
	.transports td {
		background: color-mix(in srgb, var(--field-color, #fff) 12%, white);
	}
</style>
