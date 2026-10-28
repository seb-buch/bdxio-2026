<script lang="ts">
	import type { PasskeyOnlyDemoDataRow } from '#lib/demo/models.js';

	let { record }: { record: PasskeyOnlyDemoDataRow } = $props();
	const credentials = $derived(record.passkeys_credentials ?? []);
	const presentTransports = $derived(
		new Set(credentials.flatMap(({ transports }) => JSON.parse(transports) as string[]))
	);
	const transports = [
		{
			value: 'internal',
			description:
				'Accès local à l’authentificateur intégré : sur le téléphone lui-même, par exemple'
		},
		{
			value: 'hybrid',
			description:
				'Communication et proximité combinées : le téléphone authentifie une connexion sur l’ordinateur'
		},
		{ value: 'usb', description: 'Authentificateur branché en USB' },
		{
			value: 'nfc',
			description:
				'NFC (Near Field Communication) : communication sans contact à très courte portée'
		},
		{
			value: 'ble',
			description: 'BLE (Bluetooth Low Energy) : communication Bluetooth à basse consommation'
		},
		{ value: 'smart-card', description: 'Carte à puce avec contacts (ISO 7816)' }
	];
</script>

<div class="transports-overview">
	<section>
		<h4>Passkeys enregistrées</h4>
		{#if credentials.length}
			<div class="credentials">
				{#each credentials as credential (credential.id)}
					<table aria-label={`Credential complet de la passkey ${credential.label}`}>
						<caption>{credential.label}</caption>
						<tbody>
							{#each Object.entries(credential) as [field, value] (field)}
								<tr class:transport-row={field === 'transports'}>
									<th scope="row">{field}</th>
									<td><code>{value}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		{:else}
			<p>Ajoutez une passkey pour afficher son credential.</p>
		{/if}
	</section>

	<div class="details fragment" data-fragment-index="0">
		<section>
			<h4>Comment joindre l’authentificateur ?</h4>
			<table aria-label="Transports définis dans WebAuthn Level 4">
				<tbody>
					{#each transports as transport (transport.value)}
						<tr class:present={presentTransports.has(transport.value)}>
							<th scope="row"><code>{transport.value}</code></th>
							<td>{transport.description} </td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="source">
				Plus de détails :
				<a
					href="https://www.w3.org/TR/2026/WD-webauthn-4-20260915/#enum-transport"
					target="_blank"
					rel="noreferrer">WebAuthn Level 4</a
				>
			</p>
		</section>
	</div>
</div>

<style>
	.transports-overview {
		margin-top: 28px;
		text-align: left;
	}

	h4 {
		font-size: 27px;
		margin-bottom: 1em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 22px;
	}

	th,
	td {
		padding: 7px 12px;
		border: 1px solid #d3dce8;
		text-align: left;
		overflow-wrap: anywhere;
	}

	th {
		background: #e8edf3;
	}

	td {
		background: #fff;
	}

	.credentials {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px;
		align-items: start;
	}

	.credentials table {
		table-layout: fixed;
		font-size: 21px;
	}

	.credentials caption {
		text-align: left;
		font-size: 25px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.credentials th {
		width: 23%;
	}

	.credentials code {
		font-size: 19px;
	}

	.transport-row th,
	.transport-row td {
		background: #f8eaf0;
		color: #842441;
	}

	.details {
		margin-top: 2em;
	}

	.details table {
		font-size: 20px;
	}

	.details th {
		white-space: nowrap;
	}

	.present th,
	.present td {
		background: #f8eaf0;
		color: #842441;
	}

	.source {
		font-size: 17px;
		margin: 10px 0 0;
	}
</style>
