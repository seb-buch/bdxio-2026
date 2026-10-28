<script lang="ts">
	import { Slide, SpeakerNotes, VerticalSpacer } from '@seb-buch/slyd';

	const libraries = [
		{
			lang: 'Node.js / TS',
			name: 'SimpleWebAuthn',
			repo: 'https://github.com/MasterKale/SimpleWebAuthn',
			stars: 2400
		},
		{
			lang: '.NET / C#',
			name: 'fido2-net-lib',
			repo: 'https://github.com/passwordless-lib/fido2-net-lib',
			stars: 1500
		},
		{
			lang: 'Go',
			name: 'go-webauthn/webauthn',
			repo: 'https://github.com/go-webauthn/webauthn',
			stars: 1400
		},
		{
			lang: 'Python',
			name: 'py_webauthn',
			repo: 'https://github.com/duo-labs/py_webauthn',
			stars: 1100
		},
		{
			lang: 'Rust',
			name: 'webauthn-rs',
			repo: 'https://github.com/kanidm/webauthn-rs',
			stars: 714
		},
		{
			lang: 'Java',
			name: 'webauthn4j',
			repo: 'https://github.com/webauthn4j/webauthn4j',
			stars: 597
		}
	];

	function formatStars(n: number): string {
		return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
	}
</script>

<Slide>
	<h3>Bibliothèques serveur WebAuthn</h3>
	<VerticalSpacer height="2em" />
	<table>
		<thead>
			<tr>
				<th>Langage</th>
				<th>Bibliothèque</th>
				<th class="stars-col">⭐ GitHub</th>
			</tr>
		</thead>
		<tbody>
			{#each libraries as lib (lib.repo)}
				<tr>
					<td class="label">{lib.lang}</td>
					<td class="lib-name">
						<a href={lib.repo} target="_blank" rel="external">{lib.name}</a>
					</td>
					<td class="stars">
						{formatStars(lib.stars)}&nbsp;⭐
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<SpeakerNotes>
		Voilà une sélection des bibliothèques les plus utilisées côté serveur pour implémenter WebAuthn.
		SimpleWebAuthn domine largement en Node.js avec plus de 2 000 étoiles. Pour .NET, fido2-net-lib
		est le choix évident. Go et Python ont chacun une librairie de référence bien maintenue. En
		Rust, webauthn-rs du projet Kanidm est la plus mature. Et en Java, webauthn4j et la lib Yubico
		sont toutes les deux viables — ici c'est webauthn4j qui a légèrement plus d'étoiles.
	</SpeakerNotes>
</Slide>

<style>
	table {
		box-shadow: none;
	}

	th {
		background: transparent;
		color: var(--slyd-headings-color);
		border-bottom: 2px solid var(--slyd-accent-color);
	}

	td {
		background: transparent;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		font-size: 0.85em;
	}

	.label {
		font-weight: 700;
		color: var(--slyd-headings-color);
		white-space: nowrap;
	}

	.lib-name {
		font-weight: 600;
	}

	.stars-col {
		text-align: right;
	}

	.stars {
		text-align: right;
		font-weight: 700;
	}
</style>
