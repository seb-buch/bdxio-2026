<script lang="ts">
	import { DemoError } from '#lib/demo/logic/errors.js';
	import { Slide } from '@seb-buch/slyd';
	import { untrack } from 'svelte';
	import { examplePasswordData } from '#lib/demo/example-data.js';
	import type { PasswordAuthenticationStateManager } from '#lib/demo/logic/password-demo.svelte.js';
	import type { PasswordDemoDataRow } from '#lib/demo/models.js';
	import { BASE_API_URL } from '#lib/demo/constants.js';
	import { parseArgon2id } from '#lib/demo/logic/password-attack.js';
	import DemoPasswordStoredRecord from '#lib/demo/components/DemoPasswordStoredRecord.svelte';
	import DemoPasswordHashCalculator from '#lib/demo/components/DemoPasswordHashCalculator.svelte';

	let {
		authenticationState
	}: {
		authenticationState: PasswordAuthenticationStateManager['currentState'];
	} = $props();
	let copied = $state<PasswordDemoDataRow>();
	const displayedRecord = $derived(copied ?? examplePasswordData);
	$effect(() => {
		const username =
			authenticationState.kind === 'authenticated' ? authenticationState.user.username : undefined;
		copied = undefined;
		if (!username) return;
		const controller = new AbortController();
		untrack(() => void copyRecord(username, controller.signal));
		return () => controller.abort();
	});

	async function copyRecord(username: string, signal: AbortSignal) {
		try {
			const response = await fetch(`${BASE_API_URL}/password/data`, { cache: 'no-store', signal });
			const body: PasswordDemoDataRow & { message?: string } = await response.json();
			if (signal.aborted) return;
			if (!response.ok)
				throw new DemoError(
					response.status < 500 && body.message
						? body.message
						: 'Impossible de récupérer les données.'
				);
			if (body.username !== username)
				throw new DemoError('Les données ne correspondent pas au compte connecté.');
			if (body.password_hash) parseArgon2id(body.password_hash);
			copied = body;
		} catch (cause) {
			if (!signal.aborted) {
				console.error('Demo data loading failed:', cause);
			}
		}
	}
</script>

<Slide>
	<h3>Mot de passe &ndash; données stockées</h3>
	<DemoPasswordStoredRecord record={displayedRecord} />
	{#if displayedRecord.password_hash}
		<div class="test-view fragment" data-fragment-index="7">
			<DemoPasswordHashCalculator passwordHash={displayedRecord.password_hash} />
		</div>
	{:else}
		<p class="hint">Ce compte ne possède pas de mot de passe.</p>
	{/if}
</Slide>

<style>
	.hint {
		color: #617087;
		font-size: 28px;
	}
</style>
