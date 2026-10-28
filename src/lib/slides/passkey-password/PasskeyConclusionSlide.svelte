<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Authentification mixte MFA et passkey</h3>
	<div class="points">
		<section class="fragment">
			<h4>Liée au site</h4>
			<p>La connexion par passkey résiste au phishing.</p>
		</section>
		<section class="fragment">
			<h4>Une clé publique en base</h4>
			<p>Pas de clé privée à voler dans cette base.</p>
		</section>
		<section class="fragment">
			<h4>Les autres accès restent</h4>
			<p>Mot de passe, TOTP et récupération sont encore à protéger.</p>
		</section>
	</div>
	<SpeakerNotes>
		<p>
			On a ajouté un nouveau moyen de connexion, plus simple à utiliser et fondé sur une preuve
			cryptographique liée au site. Sur ce parcours, je ne peux pas simplement recopier un secret
			dans un faux formulaire.
		</p>
		<p>
			Le serveur conserve une clé publique. Quelqu’un qui lit cette clé dans la base ne peut pas
			s’en servir pour fabriquer les signatures de l’utilisateur. Cela ne rend pas toute
			compromission du serveur inoffensive, mais supprime le secret partagé pour ce credential.
		</p>
		<p>
			En revanche, notre compte possède toujours un mot de passe et un secret TOTP. Un attaquant
			peut viser cet autre parcours, ou la récupération du compte. Ajouter une passkey ne transforme
			donc pas automatiquement tous les chemins d’accès en connexions résistantes au phishing.
		</p>
		<p>
			Le choix de garder ces méthodes peut être utile pendant une migration, mais il faut mesurer ce
			qu’on conserve comme risques. On peut maintenant aller plus loin : créer un compte directement
			avec une passkey, sans lui donner de mot de passe. C’est la prochaine étape.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.points {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 56px;
		margin-top: 150px;
		text-align: left;
	}

	h4 {
		font-size: 38px;
		line-height: 1.3;
		color: var(--slyd-headings-color);
		margin: 0 0 24px;
	}

	section p {
		font-size: 32px;
		line-height: 1.45;
		margin: 0;
	}
</style>
