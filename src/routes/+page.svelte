<script lang="ts">
	import { resolve } from '$app/paths';
	import background from '#lib/assets/slides/bdxio-back-to-school-2026-no-text.png';
</script>

<svelte:head>
	<title>Passkeys — BDX I/O 2026 · Sébastien Buchoux</title>
	<meta
		name="description"
		content="Retrouvez les diapositives, le code source et le lien de feedback du talk de Sébastien Buchoux sur les passkeys à BDX I/O 2026."
	/>
</svelte:head>

<main style:background-image={`url("${background}")`}>
	<div class="content">
		<p class="event">BDX I/O 2026</p>
		<h1>Passkeys</h1>
		<p class="subtitle">Adieu les mots de passe,<br />bonjour la sécurité sans friction !</p>
		<p class="speaker">Sébastien Buchoux</p>
		<nav aria-label="Ressources de la présentation">
			<a class="primary" href={resolve(`presentation/`)} data-sveltekit-reload>
				Voir la présentation
				<span aria-hidden="true">→</span>
			</a>
			<a href="https://github.com/seb-buch/bdxio-2026" target="_blank">
				Récupérer le code <span aria-hidden="true">↗</span>
			</a>
			<a href="https://app.voxxr.in/events/bdxio26/rate-talk/16" target="_blank">
				Donner mon avis <span aria-hidden="true">↗</span>
			</a>
		</nav>
		<p class="closing">Merci pour votre présence et vos retours !</p>
	</div>
</main>

<style>
	@font-face {
		font-family: 'Landing Sans';
		src: url('../lib/assets/fonts/nunito-sans-normal-latin.woff2') format('woff2');
		font-weight: 300 700;
		font-display: swap;
	}

	@font-face {
		font-family: 'Landing Display';
		src: url('../lib/assets/fonts/poppins-700-latin.woff2') format('woff2');
		font-weight: 700;
		font-display: swap;
	}

	:global(body) {
		margin: 0;
	}

	main {
		box-sizing: border-box;
		display: grid;
		place-items: center;
		min-height: 100svh;
		padding: 80px 24px;
		background-color: #fffdf8;
		background-position: center;
		background-size: cover;
		color: #183b40;
		font-family: 'Landing Sans', sans-serif;
		text-align: center;
	}

	.content {
		width: min(100%, 700px);
		padding: 32px 16px;
		border-radius: 24px;
		background: #fffdf8e8;
	}

	.event {
		margin: 0 0 24px;
		color: #a14e32;
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.16em;
	}

	h1 {
		margin: 0;
		font-family: 'Landing Display', sans-serif;
		font-size: clamp(48px, 10vw, 88px);
		line-height: 1.15;
	}

	.subtitle {
		margin: 20px 0 0;
		font-size: clamp(20px, 3.5vw, 30px);
		line-height: 1.45;
		text-wrap: balance;
	}

	.speaker {
		margin: 24px 0 36px;
		color: #4e6267;
		font-size: 20px;
	}

	nav {
		display: grid;
		gap: 12px;
		max-width: 360px;
		margin: auto;
	}

	a {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 22px;
		border: 1px solid #086b63;
		border-radius: 10px;
		background: #fffdf8;
		color: #086b63;
		font-size: 18px;
		font-weight: 700;
		text-decoration: none;
	}

	a.primary {
		background: #086b63;
		color: #fff;
	}

	a:hover {
		background: #edf4ee;
	}

	a.primary:hover {
		background: #06534d;
	}

	a:focus-visible {
		outline: 3px solid #a14e32;
		outline-offset: 4px;
	}

	.closing {
		margin: 28px 0 0;
		color: #4e6267;
		font-size: 15px;
	}

	@media (max-width: 600px) {
		main {
			padding: 56px 20px;
			background-size: auto 100%;
		}

		.content {
			box-sizing: border-box;
		}
	}
</style>
