<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import serverCalculation from './images/totp-animation/server-calculation.png';
	import secretSharing from './images/totp-animation/secret-sharing.png';
	import appCalculation from './images/totp-animation/app-calculation.png';
	import codeVerification from './images/totp-animation/code-verification.png';
</script>

<Slide>
	<h3>Comment fonctionne un code TOTP ?</h3>
	<p class="definition">
		<strong>TOTP = Time-based One-Time Password</strong> = Code à usage unique basé sur le temps
	</p>
	<div
		class="diagram"
		role="img"
		aria-label="Le serveur calcule un code à partir de son secret et de son horloge. À l’activation, il partage le secret avec l’application, qui peut calculer le même code avec sa propre horloge. L’utilisateur saisit le code et le serveur le vérifie."
	>
		<img class="fragment" data-fragment-index="0" src={serverCalculation} alt="" />
		<img class="fragment" data-fragment-index="1" src={secretSharing} alt="" />
		<img class="fragment" data-fragment-index="2" src={appCalculation} alt="" />
		<img class="fragment" data-fragment-index="3" src={codeVerification} alt="" />
	</div>
	<SpeakerNotes>
		<p>
			TOTP signifie Time-based One-Time Password : un code à usage unique basé sur le temps. Voyons
			d’abord ce qui se passe côté serveur.
		</p>
		<p>
			[Serveur.] Le serveur génère un secret aléatoire pour ce compte, distinct du mot de passe. À
			partir de ce secret et de son heure actuelle, il peut calculer un code temporaire. Dans notre
			démo, le temps est découpé en périodes de trente secondes : pour un même secret et une même
			période, le calcul donne le même code. Les chiffres ici sont un exemple.
		</p>
		<p>
			[Partage du secret.] Pour utiliser ce mécanisme comme deuxième facteur, il faut que mon
			application puisse produire ce code elle aussi. Lors de l’activation, le serveur lui transmet
			donc le secret, qu’elle enregistre. Nous allons le faire en scannant un QR code.
		</p>
		<p>
			[Calcul dans l’application.] L’application utilise maintenant le même secret avec sa propre
			horloge. Elle peut calculer le code sans contacter le serveur et sans connexion réseau.
		</p>
		<p>
			[Saisie et vérification.] Je recopie ce code dans le formulaire, qui l’envoie au serveur.
			L’heure n’est pas transmise : le serveur utilise sa propre horloge pour calculer le code
			attendu. Si le code reçu correspond, il valide le deuxième facteur. Il tolère un léger
			décalage des horloges, limite les tentatives et refuse de réutiliser un code déjà accepté.
		</p>
		<p>
			Le serveur ne peut pas distinguer les applications qui possèdent une copie du même secret :
			elles peuvent toutes produire le même code pour la même période. Cela vaut aussi pour une
			copie volée. Ce mécanisme vérifie l’accès au secret associé au compte, pas l’identité d’une
			application particulière. Dans notre parcours, cette vérification complète le mot de passe.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.definition {
		margin: 30px 0 0;
		font-size: 38px;
		line-height: 1.5;
	}
	.diagram {
		display: grid;
		width: 1102px;
		max-width: 100%;
		margin: 24px auto 0;
	}
	.diagram img {
		grid-area: 1 / 1;
		display: block;
		width: 100%;
		height: auto;
		opacity: 0;
		transition: opacity 220ms ease;
	}
	.diagram img:global(.revealed) {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.diagram img {
			transition: none;
		}
	}
</style>
