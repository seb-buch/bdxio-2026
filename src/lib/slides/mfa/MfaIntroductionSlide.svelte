<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Deux facteurs pour se connecter</h3>
	<div class="factors">
		<div class="password-factor">
			<strong>Mot de passe</strong>
			<span>Ce que je sais</span>
		</div>
		<div class="additional-factor fragment custom" data-fragment-index="0">
			<b>+</b>
		</div>
		<div class="additional-factor fragment custom" data-fragment-index="0">
			<strong>Application d’authentification</strong>
			<span>Ce que je possède</span>
		</div>
	</div>
	<SpeakerNotes>
		<p>
			Jusqu’ici, connaître le mot de passe suffisait pour se connecter. On va maintenant demander
			une deuxième preuve : l’accès à mon application d’authentification.
		</p>
		<p>
			[Révéler le deuxième facteur.] Le mot de passe, c’est quelque chose que je sais. L’application
			possède un secret qui lui permet de produire des codes : c’est notre preuve de possession.
			Deux mots de passe ne feraient pas deux facteurs différents.
		</p>
		<p>
			Avec ces deux facteurs, on parle de double authentification, ou 2FA : c’est un cas particulier
			de la MFA. Ici, on garde le mot de passe et on ajoute des codes TOTP. Ce sont les codes qui
			changent régulièrement dans une application d’authentification. Avant de l’activer sur notre
			compte, regardons d’où viennent ces codes.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.factors {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		gap: 80px;
		margin-top: 300px;
		text-align: center;

		div {
			display: flex;
			flex-direction: column;
			align-items: center;

			span {
				display: block;
				color: #617087;
				font-size: 30px;
				margin-top: 20px;
			}

			strong {
				font-size: 48px;
				line-height: 1.3;
			}

			b {
				color: var(--slyd-accent-color);
				font-size: 80px;
			}
		}
	}

	.password-factor {
		transform: translateX(600px);
		transition: transform 600ms ease;
	}

	.factors:has(.additional-factor:global(.revealed)) .password-factor {
		transform: translateX(0);
	}

	.factors .additional-factor {
		opacity: 0;
		visibility: hidden;
		transform: translateX(40px);
		transition:
			opacity 250ms ease,
			transform 500ms ease,
			visibility 0s linear 250ms;
	}

	.factors .additional-factor:global(.revealed) {
		opacity: 1;
		visibility: visible;
		transform: translateX(0);
		transition-delay: 250ms, 250ms, 0s;
	}

	@media (prefers-reduced-motion: reduce) {
		.password-factor,
		.factors .additional-factor {
			transition: none;
		}
	}
</style>
