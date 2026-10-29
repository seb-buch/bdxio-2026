<script lang="ts">
	import RightArrow from '#lib/common/cryptography/RightArrow.svelte';
	import CryptoKey from '#lib/common/cryptography/CryptoKey.svelte';
	import User from '#lib/common/cryptography/User.svelte';
	import PlainDocument from '#lib/common/cryptography/PlainDocument.svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	const documentSize = 256;
</script>

<Slide>
	<h3>S'authentifier par une signature</h3>

	<div class="victory-container">
		<div class="crypto-user">
			<User size="150" shirtColor="#d2745b" />
			<CryptoKey type="pair" size="128" />
		</div>
		<div class="fragment custom bob-document" data-fragment-index="1">
			<PlainDocument size={documentSize} />
		</div>
		<div class="crypto-action">
			<div class="alice-private-key fragment" data-fragment-index="2">
				<CryptoKey type="private" size="150" />
			</div>
			<div class="arrow fragment" data-fragment-index="2">
				<RightArrow />
			</div>
			<p class="description fragment" data-fragment-index="2">Signature<br />(Clé privée)</p>
		</div>
		<div class="fragment" data-fragment-index="3">
			<PlainDocument size={documentSize} state="signed" />
		</div>
	</div>

	<div class="victory-container">
		<div class="crypto-user">
			<User size="150" name="Bob" />
			<div class="fragment alice-key" data-fragment-index="4">
				<CryptoKey type="public" size="128" />
			</div>
		</div>
		<div class="fragment bob-document-signed" data-fragment-index="4">
			<PlainDocument size={documentSize} state="signed" />
		</div>
		<div class="crypto-action">
			<div class="fragment bob-verification-key" data-fragment-index="5">
				<CryptoKey type="public" size="150" />
			</div>
			<div class="arrow fragment" data-fragment-index="5">
				<RightArrow />
			</div>
			<p class="description fragment" data-fragment-index="5">Vérification<br />(Clé publique)</p>
		</div>
		<div class="fragment" data-fragment-index="6">
			<PlainDocument size={documentSize} state="verified" />
		</div>
	</div>
	<p class="fragment conclusion" data-fragment-index="7">
		Bob a authentifié Alice <em>sans</em> partager de secret&nbsp;!
	</p>

	<SpeakerNotes>
		<p>
			Reprenons Alice et Bob. Bob connaît déjà la clé publique d’Alice. Il veut vérifier qu’elle
			possède toujours la clé privée correspondante.
		</p>
		<p>
			[Message.] Il lui propose un message à signer. [Clé privée.] Alice utilise sa clé privée pour
			calculer une signature de ce message. [Résultat.] Le message reste lisible : signer ne veut
			pas dire chiffrer. On ajoute une preuve cryptographique.
		</p>
		<p>
			[Transmission.] Alice renvoie le message et sa signature. Bob utilise la clé publique d’Alice
			qu’il connaît déjà pour vérifier cette signature. Il n’a pas besoin de la clé privée. Si le
			message est modifié, la signature ne sera plus valide.
		</p>
		<p>
			[Vérification.] Une signature valide prouve l’utilisation de la clé privée correspondante.
			C’est l’association préalable de la clé publique au compte qui nous permet d’en faire une
			preuve d’authentification.
		</p>
		<p>
			Avec une passkey, le serveur fournit un nouveau challenge aléatoire à chaque demande. La
			signature lie la réponse à ce challenge et au contexte du site. Une vieille réponse ne permet
			donc pas de répondre à une nouvelle demande. Le principe reste celui que nous venons de voir :
			signer d’un côté, vérifier de l’autre.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.victory-container :global(.fragment) {
		transition:
			top 1s ease,
			left 1s ease,
			right 1s ease,
			bottom 1s ease !important;
	}

	.bob-document.fragment {
		position: relative;
		top: 420px;

		&:global(.revealed) {
			top: 0;
		}
	}

	.alice-key.fragment {
		position: relative;
		top: -400px;

		&:global(.revealed) {
			top: 0;
		}
	}

	.bob-document-signed.fragment {
		position: relative;
		top: -420px;
		left: 510px;

		&:global(.revealed) {
			top: 0;
			visibility: visible;
			left: 0;
		}
	}

	.alice-private-key.fragment,
	.bob-verification-key.fragment {
		position: relative;
		left: -470px;
		top: 170px;

		&:global(.revealed) {
			top: 0;
			left: 0;
		}
	}

	.victory-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 30px;
		padding: 1.5em 0;

		.crypto-user,
		.crypto-action {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.crypto-action {
			.arrow {
				margin: -20px 0;
			}

			.description {
				margin: 0;
				font-size: 0.7em;
				font-weight: bold;
				color: var(--slyd-main-color);
			}
		}
	}

	p.conclusion {
		text-align: center;
		font-size: 1.2em;
		font-weight: bold;
	}
</style>
