<script lang="ts">
	import { onDestroy } from 'svelte';
	import { parseArgon2id, type PasswordAttackMessage } from '#lib/demo/logic/password-attack.js';

	let { passwordHash }: { passwordHash?: string } = $props();
	let calculatedHash = $state('');
	let result = $state<{ password: string; matches: boolean; computedText: string }>();
	let message = $state('');
	let running = $state(false);
	let worker: Worker | undefined;
	const parts = $derived(passwordHash ? parseArgon2id(passwordHash) : undefined);

	function stopWorker() {
		worker?.terminate();
		worker = undefined;
		running = false;
	}

	$effect(() => {
		// A new stored hash starts a fresh calculation demo.
		void passwordHash;
		stopWorker();
		calculatedHash = '';
		result = undefined;
		message = '';
	});
	onDestroy(stopWorker);

	function calculateHash(event: SubmitEvent) {
		event.preventDefault();
		if (running || !passwordHash || !calculatedHash.length) return;
		stopWorker();
		const password = calculatedHash;
		result = undefined;
		message = '';
		running = true;
		try {
			worker = new Worker(new URL('../logic/password-attack.worker.ts', import.meta.url), {
				type: 'module'
			});
			worker.onmessage = (event: MessageEvent<PasswordAttackMessage>) => {
				const response = event.data;
				if (response.type === 'result') {
					if (calculatedHash === password)
						result = { password, matches: response.matches, computedText: response.computedText };
				} else message = response.message;
				stopWorker();
			};
			worker.onerror = () => {
				message = 'Le calcul a échoué. Vous pouvez réessayer.';
				stopWorker();
			};
			worker.postMessage({ encoded: passwordHash, candidate: password });
		} catch (cause) {
			console.error('Hash calculation failed:', cause);
			message = 'Le calcul a échoué. Réessayez.';
			stopWorker();
		}
	}
</script>

<p>Et si ces données étaient volées ?</p>
<form onsubmit={calculateHash}>
	<label for="password-candidate">Mot de passe</label>
	<div class="input-row">
		<input
			id="password-candidate"
			type="text"
			bind:value={calculatedHash}
			oninput={() => (result = undefined)}
			autocomplete="off"
			spellcheck={false}
			required
		/>
		<button type="submit" disabled={running}>{running ? 'Calcul…' : 'Calculer l’empreinte'}</button>
	</div>
</form>
<div class="comparison" aria-live="polite">
	<div class="hash-row">
		<span class="hash-label">Empreinte enregistrée</span>
		<code>{parts?.digestText ?? '—'}</code>
	</div>
	<div class="hash-row">
		<span class="hash-label">Empreinte calculée</span>
		<code class:matches={result?.matches} class:different={result && !result.matches}
			>{result?.computedText ?? '—'}</code
		>
		{#if result}
			<span
				class="verdict"
				class:different={!result.matches}
				aria-label={result.matches ? 'Empreintes identiques' : 'Empreintes différentes'}
			>
				{result.matches ? '✓' : '✕'}
			</span>
		{/if}
	</div>
</div>
{#if message}<p role="alert" class="error">{message}</p>{/if}

<style>
	button {
		border-radius: 999px;
		font-size: 27px;
	}

	form label {
		display: block;
		margin-bottom: 10px;
		font-size: 28px;
		font-weight: 600;
	}

	.input-row {
		display: flex;
		gap: 16px;
	}

	.input-row input {
		width: 580px;
		padding: 12px 18px;
		border-radius: 8px;
		font-size: 30px;
		background: #fff;
	}

	.comparison {
		margin-top: 24px;
		font-size: 28px;
	}

	.hash-row {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 12px 16px;
		border-bottom: 1px solid #dce3ed;
	}

	.hash-label {
		flex: 0 0 330px;
		color: #617087;
	}

	.comparison code {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	code.matches {
		color: #187353;
	}

	code.different {
		color: #a02b36;
	}

	.verdict {
		flex-shrink: 0;
		color: #187353;
		font-size: 28px;
		font-weight: 600;
	}

	.verdict.different {
		color: #a02b36;
	}

	.error {
		color: #a02b36;
		font-size: 28px;
	}
</style>
