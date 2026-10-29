<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Mot de passe + TOTP : le bilan</h3>
	<p class="benefit">Voler un mot de passe n’est plus suffisant pour accéder au compte.</p>
	<div class="weaknesses">
		<section class="fragment" data-fragment-index="0">
			<h4>Un geste supplémentaire</h4>
			<p>Ouvrir l’application, puis recopier le code.</p>
		</section>
		<section class="fragment" data-fragment-index="1">
			<h4>Toujours un secret partagé</h4>
			<p>Et même deux : le mot de passe et le secret TOTP.</p>
		</section>
		<section class="fragment" data-fragment-index="2">
			<h4>Phishing encore possible</h4>
			<p>
				Le faux site relaie MdP et code TOTP.<br />
				<a href="https://www.youtube.com/watch?v=jndhtwRME54" target="_blank" rel="noreferrer"
					>Présentation BreizhCamp 2026 ↗</a
				>
			</p>
		</section>
	</div>
	<SpeakerNotes>
		<p>
			Le progrès est réel : un attaquant qui connaît seulement le mot de passe ne peut plus se
			connecter par ce parcours. Il doit aussi présenter un code TOTP valide. Le code expire, et
			notre serveur refuse de réutiliser une période déjà acceptée. Mais il reste trois limites.
		</p>
		<p>
			[Geste supplémentaire.] Le coût de cette sécurité renforcée, c’est une manipulation en plus :
			ouvrir l’application et recopier le code à chaque connexion qui demande ce deuxième facteur.
			Il faut aussi prévoir la perte de l’appareil et la récupération du compte.
		</p>
		<p>
			[Secret partagé.] Nous avons même deux secrets à protéger maintenant : le mot de passe, dont
			le serveur conserve une empreinte, et le secret TOTP, que l’application et le serveur
			possèdent tous les deux. Si quelqu’un récupère ce dernier, il peut produire les mêmes codes
			dans une autre application. Il faut donc toujours protéger les deux côtés.
		</p>
		<p>
			[Phishing.] Un faux site peut me demander le mot de passe puis le code et relayer les deux au
			vrai site en temps réel. Le code n’a pas encore été utilisé et l’attaquant peut le présenter
			avant moi. Ma présentation BreizhCamp montre ce scénario, avec et sans TOTP.
		</p>
		<p>
			On renforce donc la sécurité de la connexion, mais on conserve des secrets partagés et des
			preuves qui peuvent être relayées sur un faux site. Regardons maintenant comment une paire de
			clés permet de changer ce modèle : c’est ce qui va nous amener aux passkeys.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.benefit {
		margin: 2em 0 0;
		color: #187353;
		font-size: 46px;
		font-weight: 600;
		text-align: center;
	}

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

	section p {
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
