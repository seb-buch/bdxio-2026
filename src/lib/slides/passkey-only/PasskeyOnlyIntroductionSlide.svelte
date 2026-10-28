<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import passwordIcon from '#lib/assets/icons/rectangle-ellipsis.svg';
	import passkeyIcon from '#lib/assets/icons/key-round.svg';
</script>

<Slide>
	<h3>Et si on supprimait le mot de passe ?</h3>
	<div class="recap">
		<p class="same-account">Deux méthodes pour <strong>un même compte :</strong></p>
		<div class="methods">
			<div class="method password">
				<span class="method-icon" style:--icon={`url("${passwordIcon}")`} aria-hidden="true"></span>
				<h4>Mot de passe + OTP</h4>
				<p>Authentification multifacteur</p>
			</div>
			<span class="alternative">ou</span>
			<div class="method passkey">
				<span class="method-icon" style:--icon={`url("${passkeyIcon}")`} aria-hidden="true"></span>
				<h4>Passkey</h4>
				<p>Authentification par clé publique</p>
			</div>
		</div>
		<div class="fragment answer" data-fragment-index="1">
			<span class="solution-arrow" aria-hidden="true">↓</span>
			<p>Créer la passkey <strong>dès la création du compte</strong></p>
		</div>
	</div>
	<SpeakerNotes>
		<p>
			Récapitulons les deux authentifications que nous venons de voir : le mot de passe accompagné
			d’un code OTP, et la passkey. Ces deux méthodes permettent de se connecter au même compte.
		</p>
		<p>
			[Premier avancement.] La passkey protège son propre parcours, mais l’accès par mot de passe et
			OTP reste disponible. Un attaquant peut viser cette méthode et ses secrets partagés. La
			sécurité du compte reste donc limitée par cet accès plus faible. Ici, le MFA désigne le
			parcours mot de passe et code TOTP de notre démonstration.
		</p>
		<p>
			Comment supprimer cet accès et utiliser uniquement des passkeys ? [Deuxième avancement.] Nous
			allons créer la passkey dès la création du compte, sans lui attribuer de mot de passe ni
			configurer de secret OTP. C’est l’objet de la prochaine démonstration.
		</p>
		<p>
			Le serveur conserve une clé publique, pas un secret partagé d’authentification. La clé privée
			reste gérée par l’authentificateur. Le PIN éventuellement demandé reste une validation locale.
			La récupération du compte sera abordée plus loin.
		</p>
		<p>
			Icônes Lucide : rectangle-ellipsis et key-round. Sources :
			https://github.com/lucide-icons/lucide/blob/main/icons/rectangle-ellipsis.svg et
			https://github.com/lucide-icons/lucide/blob/main/icons/key-round.svg. Licence conservée dans
			src/lib/assets/icons/LICENSE.lucide.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.recap {
		max-width: 1760px;
		margin: 48px auto 0;
		text-align: center;
	}

	.methods {
		display: grid;
		grid-template-columns: 1fr 100px 1fr;
		align-items: center;
	}

	.method-icon {
		display: block;
		width: 94px;
		height: 94px;
		margin: 0 auto 20px;
		background-color: currentColor;
		mask: var(--icon) center / contain no-repeat;
	}

	.password {
		color: var(--atlas-clay);
	}

	.passkey {
		color: var(--slyd-accent-color);
	}

	h4 {
		margin: 0;
		font-size: 54px;
		font-weight: 700;
		line-height: 1.2;
	}

	.method p {
		margin: 14px 0 0;
		color: var(--atlas-muted);
		font-size: 31px;
	}

	.alternative {
		font-size: 32px;
		font-style: italic;
		color: var(--atlas-muted);
	}

	.same-account {
		margin: 0 0 44px;
		font-size: 50px;
		line-height: 1.2;
	}

	.same-account strong {
		color: var(--slyd-headings-color);
	}

	.answer {
		margin-top: 64px;
	}

	.answer p {
		margin: 0;
		font-size: 52px;
		line-height: 1.25;
		white-space: nowrap;
	}

	.answer strong {
		color: var(--slyd-accent-color);
	}

	.solution-arrow {
		display: block;
		margin-bottom: 64px;
		font-size: 76px;
		line-height: 1;
		color: var(--slyd-accent-color);
	}
</style>
