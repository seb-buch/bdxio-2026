<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import githubPrompt from '#lib/assets/slides/github-passkey-prompt.png';
	import conditionalUi from '#lib/assets/slides/passkey-conditional-ui.png';
</script>

<Slide>
	<h3>À vous de jouer</h3>
	<div class="audiences">
		<section class="user fragment" data-fragment-index="0">
			<h4>En tant qu’utilisateur</h4>
			<p class="lead">La prochaine fois qu'un site vous propose d'utiliser une passkey…</p>
			<img
				src={githubPrompt}
				alt="GitHub propose de configurer une connexion sans mot de passe avec le bouton Add passkey."
			/>
			<p class="invitation">Essayez-la.</p>
		</section>
		<section class="developer fragment" data-fragment-index="1">
			<h4>En tant que développeur</h4>
			<p class="lead">
				Vous avez maintenant les clés pour proposer des passkeys à vos utilisateurs.
			</p>
			<img
				src={conditionalUi}
				alt="Illustration d’un champ d’identifiant et de la liste de comptes proposés pour se connecter avec une passkey."
			/>
			<p class="invitation">Essayez-les.</p>
		</section>
	</div>
	<SpeakerNotes>
		<p>
			Nous revenons à l’invitation GitHub du début. Vous savez maintenant ce qu’il y a derrière ce
			bouton. La prochaine fois qu’un site vous propose une passkey, je vous invite à l’essayer,
			tout en prévoyant un autre support indépendant comme nous venons de le voir.
		</p>
		<p>
			[Applications.] En tant que développeurs, vous avez maintenant toutes les clés pour proposer
			des passkeys à vos utilisateurs. Nous avons vu en détail l’enregistrement, la connexion et la
			vérification côté serveur. Alors, essayez-les dans vos applications : cette invitation fait
			écho à celle de la partie utilisateur.
		</p>
		<p>
			Pour un premier essai, reprenez les parcours montrés pendant la présentation. La gestion des
			passkeys et la récupération du compte font aussi partie de l’intégration, comme nous venons de
			le voir.
		</p>
		<p>
			L’illustration développeur est une image générée représentant un champ d’identifiant et une
			liste de comptes proposés par le conditional UI pour une connexion par passkey. Les comptes
			sont fictifs. Elle illustre l’expérience que les participants peuvent proposer dans leur
			propre application, sans reproduire exactement un navigateur ou un gestionnaire donné.
		</p>
		<p>
			La capture GitHub de 2023 est la même qu’au début, reproduite sans modification. La
			documentation SimpleWebAuthn reste accessible sur la diapositive de remerciements. Les autres
			bibliothèques serveur figurent dans l’annexe, après les questions.
		</p>
		<p>
			Sources : https://github.blog/news-insights/product-news/passkeys-are-generally-available/ et
			https://fidoalliance.org/specs/common-specs/fido-security-ref-v2.1-rd-20210525.html
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.audiences {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		margin-top: 44px;
		text-align: center;
	}

	.audiences section {
		min-width: 0;
	}

	h4 {
		font-size: 42px;
		line-height: 1.25;
		margin: 0;
		color: var(--slyd-headings-color);
	}

	.lead {
		font-size: 32px;
		line-height: 1.4;
		min-height: 90px;
		margin: 24px 0 0;
		text-wrap: balance;
	}

	.audiences img {
		display: block;
		width: auto;
		height: 390px;
		max-width: 100%;
		object-fit: contain;
		margin: 28px auto 0;
	}

	.invitation {
		font-size: 32px;
		color: var(--slyd-accent-color);
		margin: 20px 0 0;
	}
</style>
