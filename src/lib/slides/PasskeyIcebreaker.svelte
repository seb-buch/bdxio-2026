<script>
	import githubPrompt from '#lib/assets/slides/github-passkey-prompt.png';
	import { SpeakerNotes } from '@seb-buch/slyd';
</script>

<div class="icebreaker">
	<h2>Ça vous dit<br />quelque chose ?</h2>
	<img
		src={githubPrompt}
		alt="Capture officielle GitHub : Configure passwordless authentication. Invitation à ajouter une passkey, avec les choix Add passkey, Ask me later et Don't ask again for this browser."
	/>
</div>

<footer aria-label="Source de l’image">
	Source : <a
		href="https://github.blog/news-insights/product-news/passkeys-are-generally-available/"
		target="_blank"
		rel="noreferrer">GitHub, 2023</a
	> · © GitHub
</footer>

<SpeakerNotes>
	<p>
		Avant de rentrer dans le vif du sujet,<br />
		Est-ce que, parmi vous, certains sont déjà tombé sur ce genre de pop-up sur des sites qui vous proposaient
		de créer une passkey ?
		<br />
		Et est-ce qu'il y en a qui ont déjà utilisé ou qui utilisent régulièrement des passkeys ?
		<br />
		Dernière question, il y en a parmi vous des expertes qui ont carrément implémenté de l'authentification
		par passkey ?
	</p>
</SpeakerNotes>

<style>
	footer {
		position: absolute;
		right: 48px;
		bottom: 24px;
		font-size: 22px;
		line-height: 1.4;
		text-align: right;
		color: #58677b;
	}

	footer a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.icebreaker {
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 650px;
		align-items: center;
		gap: 100px;
	}

	h2 {
		margin: 0;
		font-size: 106px;
		line-height: 1.12;
	}

	img {
		display: block;
		max-width: 100%;
		height: 900px;
		width: auto;
		justify-self: center;
		object-fit: contain;
	}
</style>
