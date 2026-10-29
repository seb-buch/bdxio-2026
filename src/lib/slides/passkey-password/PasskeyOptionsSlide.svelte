<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Les options WebAuthn</h3>
	<table aria-label="Options WebAuthn, valeurs possibles et effets">
		<thead>
			<tr>
				<th scope="col">Ce que l’on veut</th>
				<th scope="col">Option WebAuthn</th>
				<th scope="col">Valeurs et effets</th>
			</tr>
		</thead>
		<tbody>
			<tr class="fragment" data-fragment-index="0">
				<th scope="row">Créer une passkey découvrable</th>
				<td><code>residentKey</code></td>
				<td>
					<div><code>required</code> : découvrable obligatoire</div>
					<div><code>preferred</code> : découvrable si possible</div>
					<div><code>discouraged</code> : non découvrable de préférence</div>
				</td>
			</tr>
			<tr class="fragment" data-fragment-index="1">
				<th scope="row">Retrouver le compte sans identifiant préalable</th>
				<td><code>allowCredentials</code></td>
				<td>
					<div><code>[]</code> ou omis : choix d’une passkey découvrable</div>
					<div><code>[…]</code> : limiter aux credentials listés</div>
				</td>
			</tr>
			<tr class="fragment" data-fragment-index="2">
				<th scope="row">Demander une vérification locale</th>
				<td><code>userVerification</code></td>
				<td>
					<div><code>required</code> : vérification obligatoire</div>
					<div><code>preferred</code> : vérification souhaitée</div>
					<div><code>discouraged</code> : éviter la vérification, si possible</div>
				</td>
			</tr>
			<tr class="fragment" data-fragment-index="3">
				<th scope="row">Restreindre le type d’authentificateur</th>
				<td><code>authenticatorAttachment</code></td>
				<td>
					<div><code>platform</code> : intégré à l’appareil</div>
					<div><code>cross-platform</code> : externe</div>
					<div>Omis : libre choix</div>
				</td>
			</tr>
			<tr class="fragment" data-fragment-index="4">
				<th scope="row">Demander des informations attestées sur l’authentificateur</th>
				<td>
					<code>attestation</code>
				</td>
				<td>
					<div><code>none</code> : pas d’attestation demandée</div>
					<div><code>direct</code> : attestation de l’authentificateur</div>
					<div><code>indirect</code> : intermédiaire autorisé</div>
					<div><code>enterprise</code> : identification en environnement géré</div>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="passkey-recap fragment" data-fragment-index="5">
		<section class="recap-panel" aria-labelledby="passkey-profile-title">
			<h4 id="passkey-profile-title">Passkeys grand public : un profil courant</h4>
			<dl>
				<div>
					<dt><code>residentKey</code></dt>
					<dd><code>"required"</code><span>Credential découvrable</span></dd>
				</div>
				<div>
					<dt><code>userVerification</code></dt>
					<dd><code>"preferred"</code><span>Vérification locale souhaitée</span></dd>
				</div>
				<div>
					<dt><code>attestation</code></dt>
					<dd><code>"none"</code><span>Pas d’attestation demandée</span></dd>
				</div>
			</dl>
			<p class="attachment-note">
				<code>authenticatorAttachment</code> et <code>allowCredentials</code> omis
			</p>
		</section>
	</div>
	<SpeakerNotes>
		<p>
			WebAuthn permet au site d’encadrer la création et l’utilisation des passkeys. Voici les
			principales options pour notre parcours, avec leurs valeurs et leurs effets.
		</p>
		<p>
			[Découvrabilité.] residentKey required impose un credential découvrable et l’opération échoue
			si sa création est impossible. preferred le favorise mais accepte un credential non
			découvrable. discouraged préfère le non découvrable, tout en acceptant le découvrable. C’est
			une option générale de WebAuthn : un credential non découvrable ne correspond pas à la
			définition de passkey que nous venons de donner. L’ancien nom resident key reste dans l’API.
		</p>
		<p>
			[Choix du compte.] À la connexion, allowCredentials limite la demande à une liste de
			credentials. Une liste vide ou absente permet de choisir un credential découvrable pour le
			site puis de retrouver le compte. L’interface exacte dépend du navigateur et de
			l’authentificateur ; la découvrabilité n’impose pas l’autocomplétion.
		</p>
		<p>
			[Vérification locale.] userVerification permet de demander un PIN ou une vérification
			biométrique avant d’utiliser la passkey. L’authentificateur vérifie localement que son
			utilisation est autorisée. Le site reçoit le résultat, pas le PIN ni l’empreinte.
			userVerification vaut preferred par défaut. required exige cette vérification ; preferred la
			souhaite mais accepte son absence ; discouraged préfère l’éviter, sans garantir qu’elle sera
			absente. Le serveur doit vérifier le résultat lorsqu’il l’exige.
		</p>
		<p>
			[Type d’authentificateur.] authenticatorAttachment platform restreint aux authentificateurs
			intégrés à l’appareil client, cross-platform aux authentificateurs externes, comme une clé de
			sécurité ou un téléphone utilisé depuis un autre appareil. Omettre l’option laisse le choix.
			Cette option ne détermine pas si la passkey est synchronisée.
		</p>
		<p>
			[Attestation.] Cette option concerne les informations attestées sur l’authentificateur, pas
			l’identité de l’utilisateur. WebAuthn la nomme attestation ; SimpleWebAuthn la nomme
			attestationType dans generateRegistrationOptions. none, la valeur par défaut, ne demande pas
			d’attestation de provenance. Cela ne supprime pas les vérifications du challenge, de l’origine
			ou du RP ID. C’est le choix utilisé dans le code d’enregistrement que nous verrons ensuite.
		</p>
		<p>
			direct demande l’attestation produite par l’authentificateur. indirect autorise le navigateur
			à passer par un intermédiaire, notamment pour préserver la confidentialité. enterprise est
			destiné aux environnements gérés et peut permettre d’identifier un authentificateur ; sa
			transmission dépend de la politique du navigateur. Ces valeurs expriment des préférences, pas
			une garantie de recevoir une attestation exploitable. La version de SimpleWebAuthn utilisée
			dans cette démo n’expose pas indirect dans attestationType.
		</p>
		<p>
			D’autres réglages existent, notamment excludeCredentials pour éviter un nouvel enregistrement
			d’un credential existant. Nous le retrouverons dans les exemples d’implémentation.
		</p>
		<p>
			[Profil grand public.] Il n’existe pas de triplet universel d’options qui définirait à lui
			seul une passkey grand public. Le nom de l’option est residentKey, pas userIdentity. La
			découvrabilité caractérise la passkey ; residentKey required garantit de créer un credential
			découvrable. Le guide de démarrage passkeys.dev propose residentKey required et
			userVerification preferred. Ce dernier réglage privilégie la fluidité et accepte une réponse
			sans vérification locale. Il faut l’accepter côté serveur également ; si la politique exige
			UV, utiliser required et vérifier le résultat côté serveur. Une passkey peut tout à fait être
			utilisée avec required. Le réglage attestation none évite de demander une attestation de
			provenance. Omettre authenticatorAttachment laisse le choix de l’authentificateur. Ce profil
			ne garantit pas la synchronisation des passkeys. À la connexion sans identifiant préalable,
			allowCredentials est vide ou omis ; ce paramètre concerne la demande d’authentification, pas
			la création.
		</p>
		<p>
			Sources du profil : https://passkeys.dev/docs/use-cases/bootstrapping/ et
			https://web.dev/articles/passkey-registration et
			https://developers.yubico.com/Passkeys/Passkey_relying_party_implementation_guidance/Passkey_registration_requests.html
		</p>
		<p>
			Sources : https://www.w3.org/TR/webauthn-3/#enumdef-userverificationrequirement,
			https://www.w3.org/TR/webauthn-3/#enumdef-residentkeyrequirement,
			https://www.w3.org/TR/webauthn-3/#dom-publickeycredentialrequestoptions-allowcredentials et
			https://www.w3.org/TR/webauthn-3/#enumdef-authenticatorattachment,
			https://www.w3.org/TR/webauthn-3/#enumdef-attestationconveyancepreference et
			https://simplewebauthn.dev/docs/packages/server#1-generate-registration-options
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.passkey-recap {
		position: absolute;
		inset: 0;
		z-index: 5;
		display: grid;
		place-items: center;
		background: #183b4059;
		pointer-events: none;
	}

	.recap-panel {
		box-sizing: border-box;
		width: 1500px;
		padding: 55px 60px;
		border: 2px solid var(--atlas-rule);
		border-top: 8px solid var(--slyd-accent-color);
		border-radius: 12px;
		background: var(--slyd-slide-bg-color);
	}

	.recap-panel h4 {
		margin: 0 0 38px;
		font-size: 46px;
		color: var(--slyd-headings-color);
	}

	.recap-panel dl {
		margin: 0;
	}

	.recap-panel dl > div {
		display: grid;
		grid-template-columns: 400px 1fr;
		align-items: baseline;
		padding: 22px 0;
		border-bottom: 1px solid var(--atlas-rule);
		font-size: 32px;
	}

	.recap-panel dd {
		display: grid;
		grid-template-columns: 260px 1fr;
		gap: 20px;
		margin: 0;
	}

	.recap-panel dd > code {
		color: var(--slyd-accent-color);
		font-weight: 600;
	}

	.attachment-note {
		margin: 32px 0 0;
		text-align: center;
		font-size: 0.6em;
		font-style: italic;
	}

	table {
		margin-top: 40px;
		table-layout: fixed;
		font-size: 28px;
		line-height: 1.3;
	}

	table,
	tr,
	th,
	td {
		border: none;
	}

	th,
	td {
		padding: 14px 22px;
		vertical-align: center;
	}

	th:first-child {
		width: 27%;
	}

	th:nth-child(2) {
		width: 29%;
	}

	tbody th {
		font-weight: 600;
		text-align: left;
	}

	td div + div {
		margin-top: 4px;
	}

	td:last-child code {
		color: var(--slyd-accent-color);
		font-weight: 600;
	}
</style>
