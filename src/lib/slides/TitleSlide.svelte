<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<div class="title-page">
		<p class="event">BDX I/O 2026</p>
		<h1>Passkeys : Adieu les mots de passe, bonjour la sécurité sans friction !</h1>
		<p class="speaker">Sébastien Buchoux</p>
	</div>
	<SpeakerNotes>
		<p>
			Bonjour à toutes et tous.<br />
			Évidemment, avant de commencer, je voudrais remercier l'organisation de BDX I/O pour me permettre
			de vous parler aujourd'hui, pendant une quarantaine de minutes d'authentification et de passkeys.
			Je suis d'autant plus content d'être présent aujourd'hui que ça me permet de revenir sur le campus
			de Talence, où j'ai fait mes études il y a quelques années maintenant...
		</p>
		<p>
			Fond : illustration BDX I/O 2026, texte central retiré avec Imagegen.
			https://bdxio.fr/_ipx/_/images/illustrations/back-to-school-2026.png
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.title-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	.title-page .event {
		margin: 0 0 56px;
		font-size: 40px;
		font-weight: 700;
	}

	.title-page h1 {
		margin: 0;
		max-width: 1040px;
		font-size: 88px;
		text-wrap: balance;
	}

	.title-page .speaker {
		margin: 64px 0 0;
		font-size: 48px;
	}
</style>
