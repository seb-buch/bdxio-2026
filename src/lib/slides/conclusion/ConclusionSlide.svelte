<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import keyIcon from '#lib/assets/icons/material/vpn-key.svg';

	const stages = [
		{ title: 'Mot de passe', caption: 'Saisir un secret', kind: 'password' },
		{ title: 'Mot de passe + TOTP', caption: 'Ajouter une vérification', kind: 'totp' },
		{ title: 'Coexistence', caption: 'Proposer une autre connexion', kind: 'mixed' },
		{ title: 'Passkeys seules', caption: 'Se passer du mot de passe', kind: 'passkey' }
	];
</script>

<Slide>
	<h3>Du mot de passe à la passkey</h3>
	<ol class="journey" aria-label="Les quatre parcours d’authentification démontrés">
		{#each stages as stage, index (stage.kind)}
			<li class="fragment" data-fragment-index={index}>
				<span class="milestone" aria-hidden="true">{index + 1}</span>
				<h4>{stage.title}</h4>
				<div class="method" aria-hidden="true">
					{#if stage.kind !== 'passkey'}<span class="password"
							>••••••
							{#if stage.kind === 'mixed'}<small>+ TOTP</small>{/if}</span
						>{/if}
					{#if stage.kind === 'totp'}<span class="operator">+</span><span class="otp">123 456</span
						>{/if}
					{#if stage.kind === 'mixed'}<span class="operator">ou</span>{/if}
					{#if stage.kind === 'mixed' || stage.kind === 'passkey'}<span
							class="key"
							style:mask-image={`url("${keyIcon}")`}
						></span>{/if}
				</div>
				<p>{stage.caption}</p>
			</li>
		{/each}
	</ol>

	<div class="fragment" data-fragment-index="4">
		<table class="comparison" aria-label="Forces et limites du mot de passe et des passkeys">
			<thead>
				<tr>
					<td></td>
					<th scope="col">Mot de passe</th>
					<th scope="col">Passkeys</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Phishing</th>
					<td class="limitation"><span aria-hidden="true">✕</span> Sensible au phishing</td>
					<td class="strength"><span aria-hidden="true">✓</span> Résistantes au phishing</td>
				</tr>
				<tr>
					<th scope="row">Accès depuis un nouvel appareil</th>
					<td class="strength"><span aria-hidden="true">✓</span> Saisissable de mémoire </td>
					<td class="limitation"
						><span aria-hidden="true">✕</span> Accès à la passkey nécessaire
					</td>
				</tr>
			</tbody>
		</table>
		<p class="reference">
			<a
				href="https://www.w3.org/TR/webauthn-3/#sctn-credential-loss"
				target="_blank"
				rel="noreferrer">WebAuthn · Perte des credentials et mobilité des clés</a
			>
		</p>
	</div>

	<SpeakerNotes>
		<p>
			Nous avons suivi quatre parcours : un mot de passe, l’ajout d’un code TOTP, l’ajout d’une
			passkey en conservant les accès existants, puis un compte créé et utilisé uniquement avec des
			passkeys. Cette frise reprend les démonstrations ; elle ne classe pas les parcours sur une
			échelle où chaque étape serait meilleure sur tous les plans.
		</p>
		<p>
			[Forces et limites.] Le TOTP ajoute une vérification mais conserve des secrets partagés et
			reste exposé au phishing en temps réel. La coexistence offre un autre accès, mais le parcours
			par mot de passe reste à protéger. Sans mot de passe, la disponibilité des passkeys devient
			essentielle. Aucune solution n’élimine toutes les difficultés.
		</p>
		<p>
			[Mot de passe.] Si je connais mon mot de passe, je peux le saisir sur un nouvel appareil sans
			disposer de mon équipement personnel ni de mon gestionnaire. Cela suppose un parcours par mot
			de passe seul, sans second facteur ni vérification supplémentaire imposée par le service. Un
			mot de passe généré que je n’ai pas mémorisé dépend lui aussi de l’accès à sa sauvegarde ou à
			son gestionnaire. Le mot de passe reste sensible au phishing.
		</p>
		<p>
			[Passkeys.] La passkey apporte une preuve cryptographique liée au site, sans secret partagé
			avec le serveur pour ce credential. Cette propriété concerne le parcours par passkey ; elle ne
			protège pas automatiquement les autres accès ni toutes les fonctions de l’application.
		</p>
		<p>
			[Disponibilité.] Pour me connecter par passkey sur un nouvel appareil, je dois avoir accès à
			un authentificateur qui la détient. La passkey peut être synchronisée ou restaurée via un
			gestionnaire, conservée sur une clé de sécurité, ou utilisée depuis un téléphone via
			l’authentification inter-appareils. L’appareil d’origine n’est donc pas toujours nécessaire.
			Connaître le PIN de déverrouillage ne suffit pas à recréer la passkey sur un appareil
			quelconque. Plusieurs moyens d’accès indépendants réduisent le risque de perdre tous les
			accès, comme le recommande le W3C.
		</p>
		<p>
			[Récupération du compte.] Le service peut aussi prévoir une procédure de récupération qui
			autorise l’enregistrement d’une nouvelle passkey, par exemple après vérification d’un lien
			envoyé par mail. La récupération du compte n’est donc pas un avantage propre au mot de passe.
			Ce parcours de secours doit être protégé puisqu’il peut contourner la connexion par passkey.
		</p>
		<p>
			Sources : https://www.w3.org/TR/webauthn-3/#sctn-credential-loss et
			https://fidoalliance.org/wp-content/uploads/2024/05/Synced-Passkey-Deployment_-Emerging-Practices-for-Consumer-Use-Cases_2024-May-31.pdf
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.journey {
		display: flex;
		gap: 32px;
		margin: 70px 0 0;
		padding: 0;
		list-style: none;
		text-align: center;
	}

	.journey li {
		position: relative;
		flex: 1;
		min-width: 0;
		margin: 0;
		padding: 0;
	}

	.journey li:not(:first-child)::before {
		content: '';
		position: absolute;
		top: 27px;
		left: calc(-50% + 6px);
		width: calc(100% - 44px);
		height: 2px;
		background: var(--atlas-rule);
	}

	.milestone {
		display: inline-flex;
		width: 56px;
		height: 56px;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--slyd-accent-color);
		border-radius: 50%;
		font-size: 26px;
		font-weight: 700;
		color: var(--slyd-accent-color);
		background: var(--slyd-slide-bg-color);
	}

	h4 {
		font-size: 30px;
		margin: 25px 0 0;
		min-height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.25;
	}

	.method {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		height: 100px;
		color: var(--slyd-accent-color);
	}

	.password,
	.otp {
		border: 2px solid var(--atlas-rule);
		background: #fff;
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 29px;
		letter-spacing: 2px;
	}

	.password {
		font-size: 34px;
	}

	.password small {
		display: block;
		font-size: 18px;
		letter-spacing: 0;
		line-height: 1.2;
	}

	.operator {
		font-size: 24px;
		color: var(--atlas-muted);
	}

	.key {
		width: 70px;
		height: 70px;
		background: currentColor;
		mask: center / contain no-repeat;
	}

	.journey p {
		font-size: 25px;
		max-width: 90%;
		margin: 12px auto 0;
		text-wrap: balance;
		color: var(--atlas-muted);
	}

	.comparison {
		width: 1500px;
		table-layout: fixed;
		border-collapse: separate;
		border-spacing: 0;
		margin-top: 3em;
		text-align: left;

		& th,
		& td {
			padding: 18px 24px;
			border-bottom: 1px solid var(--atlas-rule);
			vertical-align: middle;
			background: transparent;
			font-size: 29px;
			line-height: 1.3;

			&:first-child {
				width: 500px;
			}
		}
	}

	.comparison thead th {
		font-size: 38px;
		color: var(--slyd-headings-color);
		border-bottom: 2px solid var(--slyd-accent-color);
	}

	.comparison tbody th {
		font-size: 29px;
		font-weight: 600;
	}

	.comparison .strength {
		color: var(--slyd-accent-color);
	}

	.comparison .limitation {
		color: #a13232;
	}

	.comparison td > span {
		font-weight: 700;
	}

	.reference {
		position: absolute;
		right: var(--slyd-slide-padding, 40px);
		bottom: 24px;
		text-align: right;
		margin: 0;
		font-size: 19px;
	}
</style>
