<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Les limites du mot de passe</h3>
	<div class="weaknesses">
		<section class="weakness fragment" data-fragment-index="0">
			<h4>Un secret partagé</h4>
			<p>Deux côtés à protéger : l’utilisateur et le serveur.</p>
		</section>
		<section class="weakness fragment" data-fragment-index="1">
			<h4>Faible ou réutilisé</h4>
			<p>Un mot de passe deviné ou volé peut ouvrir plusieurs comptes.</p>
		</section>
		<section class="weakness fragment" data-fragment-index="2">
			<h4>Phishing</h4>
			<p>
				Un faux site pour récupérer MdP.<br />
				<a href="https://www.youtube.com/watch?v=jndhtwRME54" target="_blank" rel="noreferrer"
					>Présentation BreizhCamp 2026 ↗</a
				>
			</p>
		</section>
	</div>
	<SpeakerNotes>
		<p>
			On a vu comment le mot de passe fonctionne et comment on peut tester des hypothèses à partir
			d’une empreinte volée. Pour terminer, je retiens trois limites.
		</p>
		<p>
			[Secret partagé.] Il faut protéger le secret côté utilisateur et les données de vérification
			côté serveur. Le vol des empreintes permet des essais hors ligne.
		</p>
		<p>
			[Faible ou réutilisé.] Un mot de passe prévisible peut être deviné, comme on vient de le voir.
			Et si je le réutilise, une fuite sur un service peut permettre de se connecter à d’autres.
		</p>
		<p>
			[Phishing.] Enfin, je peux saisir mon mot de passe sur un faux site. Même un mot de passe très
			complexe peut être récupéré de cette façon. Le lien renvoie à ma démo de ce scénario.
		</p>
		<p>
			[Transition.] Et si le mot de passe était volé ? Comment éviter que sa connaissance suffise
			pour entrer ? C’est ce qu’on va regarder avec un deuxième facteur.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.weaknesses {
		position: absolute;
		top: 50%;
		left: var(--slyd-slide-padding, 40px);
		right: var(--slyd-slide-padding, 40px);
		transform: translateY(-50%);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: center;
		gap: 64px;
		text-align: center;
	}

	h4 {
		margin: 0 0 24px;
		color: var(--slyd-headings-color);
		font-size: 38px;
		line-height: 1.3;
	}

	.weakness p {
		margin: 0;
		font-size: 32px;
		line-height: 1.45;
	}

	a {
		display: inline-block;
		color: var(--slyd-accent-color);
		font-size: 24px;
	}
</style>
