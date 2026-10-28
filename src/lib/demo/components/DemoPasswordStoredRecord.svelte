<script lang="ts">
	import type { PasswordDemoDataRow } from '#lib/demo/models.js';

	let { record }: { record: PasswordDemoDataRow } = $props();
	const fields = $derived(Object.entries(record));
	const phc = $derived(record.password_hash?.split('$').slice(1) ?? []);
	const userFields = ['user_id', 'username', 'firstname', 'lastname'];
</script>

<div class="record">
	<div class="data-groups">
		<span class="user-label fragment" data-fragment-index="0">Données utilisateur</span>
		<span class="auth-label fragment" data-fragment-index="1">Mot de passe</span>
	</div>
	<table aria-label="Données utilisateur et mot de passe haché enregistrés">
		<colgroup>
			{#each fields as [column] (column)}
				<col class:password-column={column === 'password_hash'} />
			{/each}
		</colgroup>
		<thead>
			<tr>
				{#each fields as [column] (column)}
					<th
						scope="col"
						class:user-field={userFields.includes(column)}
						class:user-start={column === 'user_id'}
						class:user-end={column === 'lastname'}
						class:auth-field={column === 'password_hash'}>{column}</th
					>
				{/each}
			</tr>
		</thead>
		<tbody>
			<tr>
				{#each fields as [column, value] (column)}
					<td
						class:user-field={userFields.includes(column)}
						class:user-start={column === 'user_id'}
						class:user-end={column === 'lastname'}
						class:auth-field={column === 'password_hash'}
					>
						{#if column === 'password_hash'}
							<code class="encoded"
								><span class="part algorithm">$<span>{phc[0]}</span></span><span
									class="part version">$<span>{phc[1]}</span></span
								><span class="part parameters">$<span>{phc[2]}</span></span><span class="part salt"
									>$<span>{phc[3]}</span></span
								><span class="part digest">$<span>{phc[4]}</span></span></code
							>
						{:else}<code>{value}</code>{/if}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div>

<dl class="legend" aria-label="Décomposition du champ stocké">
	<div class="algorithm-label algorithm fragment" data-fragment-index="2">
		<dt>Algorithme</dt>
		<dd><code>{phc[0] ?? ''}</code></dd>
	</div>
	<div class="version-label version fragment" data-fragment-index="3">
		<dt>Version</dt>
		<dd><code>{phc[1]?.split('=')[1] ?? ''}</code></dd>
	</div>
	<div class="parameters-label parameters fragment" data-fragment-index="4">
		<dt>Paramètres</dt>
		<dd><code>{phc[2] ?? ''}</code></dd>
	</div>
	<div class="salt-label salt fragment" data-fragment-index="5">
		<dt>Sel</dt>
		<dd><code>{phc[3] ?? ''}</code></dd>
	</div>
	<div class="digest-label digest fragment" data-fragment-index="6">
		<dt>Empreinte</dt>
		<dd><code>{phc[4] ?? ''}</code></dd>
	</div>
</dl>

<style>
	.record {
		overflow: auto;
	}

	.data-groups {
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 24px;
		margin-bottom: 12px;
		font-size: 32px;
		font-weight: 600;
	}

	.user-label {
		color: #214ed3;
	}

	.auth-label {
		color: #7950a3;
	}

	.record:has(.user-label:global(.revealed)) th.user-field {
		border-top: 5px solid #214ed3;
	}

	.record:has(.user-label:global(.revealed)) td.user-field {
		border-bottom: 5px solid #214ed3;
	}

	.record:has(.user-label:global(.revealed)) .user-start {
		border-left: 5px solid #214ed3;
	}

	.record:has(.user-label:global(.revealed)) .user-end {
		border-right: 5px solid #214ed3;
	}

	.record:has(.auth-label:global(.revealed)) th.auth-field {
		border-top: 5px solid #7950a3;
	}

	.record:has(.auth-label:global(.revealed)) td.auth-field {
		border-bottom: 5px solid #7950a3;
	}

	.record:has(.auth-label:global(.revealed)) .auth-field {
		border-left: 5px solid #7950a3;
		border-right: 5px solid #7950a3;
	}

	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		font-size: 24px;
		text-align: left;
	}

	.password-column {
		width: 40%;
	}

	th,
	td {
		padding: 18px;
		border: 1px solid #d3dce8;
		vertical-align: top;
	}

	th {
		background: #e8edf3;
		font-family: monospace;
		font-weight: 600;
	}

	td {
		background: #fff;
		overflow-wrap: anywhere;
	}

	.part {
		color: inherit;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}

	.record:has(+ .legend .algorithm-label:global(.revealed)) .part.algorithm,
	.record:has(+ .legend .version-label:global(.revealed)) .part.version,
	.record:has(+ .legend .parameters-label:global(.revealed)) .part.parameters,
	.record:has(+ .legend .salt-label:global(.revealed)) .part.salt,
	.record:has(+ .legend .digest-label:global(.revealed)) .part.digest {
		color: var(--part-color);
		background: color-mix(in srgb, currentColor 12%, white);
		outline: 2px solid currentColor;
		border-radius: 3px;
	}

	.algorithm {
		--part-color: #214ed3;
	}

	.version {
		--part-color: #7950a3;
	}

	.parameters {
		--part-color: #126d70;
	}

	.salt {
		--part-color: #95600c;
	}

	.digest {
		--part-color: #a52e53;
	}

	.legend {
		display: grid;
		grid-template-columns: 0.8fr 0.5fr 1.1fr 1.2fr 1.8fr;
		gap: 28px;
		margin: 24px 0 32px;
		font-size: 27px;
		font-weight: 600;
	}

	.legend > div {
		min-width: 0;
		color: var(--part-color);
	}

	.legend dt {
		margin-bottom: 10px;
	}

	.legend dd {
		margin: 0;
		font-size: 24px;
		font-weight: 400;
		overflow-wrap: anywhere;
	}
</style>
