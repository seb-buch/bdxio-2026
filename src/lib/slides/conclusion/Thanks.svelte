<script>
	import { QRCode, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import photo from '#lib/assets/slides/sebastien-buchoux.jpg';
	import onepointLogo from '#lib/assets/slides/onepoint_logo.png';
	import githubIcon from '#lib/assets/icons/brands/github.svg';
	import linkedinIcon from '#lib/assets/icons/brands/linkedin.svg';
</script>

<Slide>
	<div class="thanks-layout">
		<div class="who-i-am">
			<img class="portrait" src={photo} alt="Sébastien Buchoux" />
			<p class="name">Sébastien Buchoux</p>
			<p class="role">Tech Lead / Architecte Logiciel</p>
			<img class="company" src={onepointLogo} alt="Onepoint" />
			<a
				class="social-link"
				href="https://github.com/seb-buch"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub : seb-buch"
			>
				<span class="social-icon" style:mask-image={`url("${githubIcon}")`} aria-hidden="true"
				></span>
				seb-buch
			</a>
			<a
				class="social-link"
				href="https://www.linkedin.com/in/sebastien-buchoux/"
				target="_blank"
				rel="noreferrer"
				aria-label="LinkedIn : sebastien-buchoux"
			>
				<span class="social-icon" style:mask-image={`url("${linkedinIcon}")`} aria-hidden="true"
				></span>
				sebastien-buchoux
			</a>
		</div>
		<div class="thanks">
			<h1>Merci !</h1>
			<p>Questions ?</p>
		</div>
		<div class="resources">
			<QRCode
				url="https://seb-buch.github.io/bdxio-2026/"
				size="360px"
				legend="Diapos/Repo/Feedback"
			/>
			<div class="documentation">
				<p>
					Pour aller plus loin<br />
					<a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer"
						>Spécification WebAuthn 3</a
					>
				</p>
			</div>
		</div>
	</div>
	<SpeakerNotes>
		<p>
			Merci beaucoup pour votre attention. Si vous avez des questions, c’est le moment. N’hésitez
			pas à venir me voir après la session pour poursuivre la discussion.
		</p>
		<p>
			Les liens à gauche donnent accès à mes profils GitHub et LinkedIn. Le QR code pointe vers la
			page dédiée qui regroupe le dépôt, les diapos et le feedback. Le lien sous le QR code donne
			accès à la spécification WebAuthn.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.thanks-layout {
		display: grid;
		grid-template-columns: 520px 1fr 540px;
		align-items: center;
		gap: 60px;
		height: 100%;
		text-align: center;
	}

	.who-i-am,
	.resources,
	.documentation {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.who-i-am {
		gap: 20px;
	}

	.portrait {
		width: 250px;
		height: 250px;
		border-radius: 50%;
		object-fit: cover;
	}

	.name {
		margin: 8px 0 0;
		font-size: 42px;
		font-weight: 700;
		color: var(--slyd-headings-color);
	}

	.role {
		margin: 0;
		font-size: 28px;
	}

	.company {
		width: 200px;
		height: auto;
		margin: 12px 0;
	}

	a {
		font-size: 26px;
		font-weight: normal;
		color: var(--slyd-accent-color);
		text-underline-offset: 5px;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 14px;
	}

	.social-icon {
		width: 30px;
		height: 30px;
		flex-shrink: 0;
		background: currentColor;
		mask: center / contain no-repeat;
	}

	.thanks h1 {
		margin: 0;
		font-size: 112px;
		text-align: center;
	}

	.thanks p {
		margin-top: 36px;
		font-size: 52px;
	}

	.resources {
		gap: 20px;
		font-size: 28px;
	}

	.resources :global(figure) {
		margin: 0;
	}

	.resources :global(figcaption) {
		margin-top: 20px;
		font-size: 28px;
	}

	.documentation {
		gap: 16px;
		margin-top: 32px;
	}

	.documentation p {
		margin: 0 0 8px;
		font-weight: 700;
	}
</style>
