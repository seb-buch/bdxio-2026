<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/common/cryptography/CryptoKey.svelte';
</script>

<Slide>
	<h3>La cryptographie asymétrique</h3>
	<div class="asymmetric-keys">
		<div class="keys">
			<div class="key">
				<CryptoKey type="private" orientation="vertical" size="180" />
				<strong>Clé privée</strong>
				<span>À garder secrète</span>
			</div>
			<div class="key">
				<CryptoKey type="public" orientation="vertical" size="180" />
				<strong>Clé publique</strong>
				<span>Partageable</span>
			</div>
		</div>
		<svg class="connections" viewBox="0 0 1920 1080" aria-hidden="true">
			<g class="connector fragment custom" data-fragment-index="0">
				<path d="M 960 540 C 960 620, 550 610, 550 700" />
			</g>
			<g class="connector fragment custom" data-fragment-index="1">
				<path d="M 960 540 C 960 620, 1370 610, 1370 700" />
			</g>
		</svg>
		<div class="uses">
			<section class="usage fragment custom" data-fragment-index="0">
				<h4>Chiffrement</h4>
				<p>
					<strong class="public">Clé publique</strong> <span aria-hidden="true">→</span> chiffrer
				</p>
				<p>
					<strong class="private">Clé privée</strong> <span aria-hidden="true">→</span> déchiffrer
				</p>
			</section>
			<section class="usage fragment custom" data-fragment-index="1">
				<h4>Signature</h4>
				<p><strong class="private">Clé privée</strong> <span aria-hidden="true">→</span> signer</p>
				<p>
					<strong class="public">Clé publique</strong> <span aria-hidden="true">→</span> vérifier
				</p>
			</section>
		</div>
	</div>
	<SpeakerNotes>
		<p>
			La cryptographie asymétrique utilise une paire de clés liées. La clé privée doit rester
			secrète ; la clé publique peut être partagée. Les deux clés ont des rôles complémentaires.
		</p>
		<p>
			[Chiffrement.] Un premier usage est le chiffrement : la clé publique sert à chiffrer et la clé
			privée correspondante à déchiffrer.
		</p>
		<p>
			[Signature.] Un autre usage est la signature : la clé privée sert à signer et la clé publique
			à vérifier la signature. Selon l’usage, on choisit un algorithme et une paire de clés adaptés.
		</p>
		<p>
			Pour les passkeys, c’est la signature qui nous intéresse. Voyons comment elle permet de
			prouver la possession de la clé privée sans la transmettre.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.keys,
	.uses .usage {
		box-sizing: border-box;
		border: 3px solid var(--slyd-accent-color);
		border-radius: 64px;
		background: var(--slyd-slide-bg-color);
	}

	.keys {
		position: absolute;
		top: 180px;
		left: 50%;
		width: 840px;
		padding: 24px 44px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 60px;
		transform: translate(-50%, 150px);
		transition: transform 600ms ease;
	}

	.asymmetric-keys:has(.usage:global(.revealed)) .keys {
		transform: translate(-50%, 0);
	}

	.key {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;
	}

	.key strong {
		color: var(--slyd-headings-color);
		font-size: 40px;
	}

	.key > span {
		color: #617087;
		font-size: 30px;
	}

	.connections {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		fill: none;
		stroke: var(--slyd-accent-color);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.connections .connector {
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 350ms ease,
			visibility 0s linear 350ms;
	}

	.connections .connector:global(.revealed) {
		opacity: 1;
		visibility: visible;
		transition-delay: 150ms, 0s;
	}

	.uses {
		position: absolute;
		top: 700px;
		left: 50%;
		width: 1540px;
		transform: translateX(-50%);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 100px;
	}

	.uses .usage {
		padding: 24px 28px;
		text-align: center;
		opacity: 0;
		visibility: hidden;
		transform: translateY(24px);
		transition:
			opacity 350ms ease,
			transform 500ms ease,
			visibility 0s linear 350ms;
	}

	.uses .usage:global(.revealed) {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		transition-delay: 150ms, 150ms, 0s;
	}

	h4 {
		margin: 0 0 24px;
		color: var(--slyd-headings-color);
		font-size: 44px;
	}

	.usage p {
		margin: 12px 0;
		font-size: 34px;
	}

	.usage p span {
		margin: 0 12px;
		color: #617087;
	}

	.private {
		color: #9c4746;
	}

	.public {
		color: #28704b;
	}

	@media (prefers-reduced-motion: reduce) {
		.keys,
		.connections .connector,
		.uses .usage {
			transition: none;
		}
	}
</style>
