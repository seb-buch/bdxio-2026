<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import { DEMO_ORIGIN, DEMO_RP_ID } from '#lib/demo/webauthn.js';
</script>

{#snippet keyIcon()}
	<svg class="key" viewBox="0 0 64 32" aria-hidden="true">
		<circle cx="16" cy="16" r="11" />
		<path d="M27 16H58M46 16V25M55 16V23" />
	</svg>
{/snippet}

<Slide>
	<h3>Découvrable… par qui ?</h3>
	<div class="discovery">
		<div class="server fragment" data-fragment-index="0">
			<svg viewBox="0 0 48 56" aria-hidden="true">
				<rect x="5" y="3" width="38" height="50" rx="3" />
				<path d="M12 17H29M12 28H29M12 39H29" />
				<circle cx="35" cy="17" r="1" />
				<circle cx="35" cy="28" r="1" />
			</svg>
			<div>
				<strong><span class="step">2</span> Serveur du site · RP</strong><code>{DEMO_RP_ID}</code>
			</div>
		</div>

		<svg class="connections" viewBox="0 0 1800 820" aria-hidden="true">
			<defs>
				<marker
					id="discovery-arrow"
					viewBox="0 0 10 10"
					refX="0"
					refY="5"
					markerUnits="userSpaceOnUse"
					markerWidth="30"
					markerHeight="30"
					orient="auto-start-reverse"
				>
					<path d="M0 0L10 5L0 10Z" fill="var(--slyd-accent-color)" stroke="none" />
				</marker>
			</defs>
			<g class="fragment" data-fragment-index="0">
				<path
					d="M330 160V140"
					marker-end="url(#discovery-arrow)"
					marker-start="url(#discovery-arrow)"
				/>
			</g>
			<g class="fragment" data-fragment-index="2">
				<path d="M700 350H1120" marker-end="url(#discovery-arrow)" />
			</g>
			<g class="fragment" data-fragment-index="4">
				<path d="M1150 620H730" marker-end="url(#discovery-arrow)" />
			</g>
		</svg>
		<p class="visit fragment" data-fragment-index="0">Ouvrir le site</p>

		<section class="browser" aria-label="Navigateur, client WebAuthn">
			<div class="browser-tabs" aria-hidden="true">
				<div class="window-controls"><i></i><i></i><i></i></div>
				<div class="active-tab">BDX I/O <span>×</span></div>
				<span class="new-tab">+</span>
			</div>
			<div class="browser-bar">
				<svg class="browser-navigation" viewBox="0 0 86 24" aria-hidden="true">
					<path
						d="M14 5L7 12L14 19M7 12H24M38 5L45 12L38 19M28 12H45M78 8A8 8 0 1 0 79 15M78 3V9H72"
					/>
				</svg>
				<div class="address">
					<svg viewBox="0 0 20 24" aria-hidden="true">
						<rect x="3" y="10" width="14" height="11" rx="2" />
						<path d="M6 10V6A4 4 0 0 1 14 6V10" />
					</svg>
					<code>{DEMO_ORIGIN}/connexion</code>
				</div>
			</div>
			<div class="browser-body">
				<h4><span class="step">1</span> Navigateur <small>Client WebAuthn</small></h4>
				<h5 class="context-heading fragment" data-fragment-index="1">
					<span class="step">3</span> Validation origine / RP ID
				</h5>
				<dl class="fragment" data-fragment-index="1">
					<div>
						<dt>Origine de la page</dt>
						<dd><code>{DEMO_ORIGIN}</code></dd>
					</div>
					<div>
						<dt>RP ID demandé</dt>
						<dd><code>{DEMO_RP_ID}</code></dd>
					</div>
				</dl>
				<p class="validation fragment" data-fragment-index="1">
					✓ L’origine peut utiliser ce RP ID
				</p>
				<div class="accounts fragment" data-fragment-index="4">
					<span>Alice</span><span>Bob</span>
				</div>
			</div>
		</section>

		<div class="request fragment" data-fragment-index="2">
			<p><span class="step">4</span> Des passkeys pour</p>
			<code>{DEMO_RP_ID} ?</code>
		</div>

		<section
			class="authenticator fragment"
			data-fragment-index="2"
			aria-label="Authentificateur, filtrage des credentials par RP ID"
		>
			<h4>Authentificateur</h4>
			<p class="filter fragment" data-fragment-index="3">
				<span class="step">5</span> Filtrage par RP ID
			</p>
			<div class="credential match fragment custom" data-fragment-index="3">
				{@render keyIcon()}
				<div><strong>Alice</strong><code>{DEMO_RP_ID}</code></div>
				<span class="status fragment" data-fragment-index="3" aria-label="Correspond au RP ID"
					>✓</span
				>
			</div>
			<div class="credential match fragment custom" data-fragment-index="3">
				{@render keyIcon()}
				<div><strong>Bob</strong><code>{DEMO_RP_ID}</code></div>
				<span class="status fragment" data-fragment-index="3" aria-label="Correspond au RP ID"
					>✓</span
				>
			</div>
			<div class="credential excluded fragment custom" data-fragment-index="3">
				{@render keyIcon()}
				<div><strong>Autre compte</strong><code>autre-site.fr</code></div>
				<span class="status fragment" data-fragment-index="3">≠</span>
			</div>
		</section>

		<div class="result fragment" data-fragment-index="4">
			<span class="step">6</span> Comptes disponibles
		</div>
	</div>
	<SpeakerNotes>
		<p>
			La définition se termine par « credential WebAuthn découvrable ». Découvrable par qui ? Par le
			navigateur et l’authentificateur, pour le site que je visite. Cela ne signifie pas que ma
			passkey ou ma clé privée deviennent publiques.
		</p>
		<p>[1. Navigateur.] L’adresse affichée est https://bdxio2026.demo/connexion.</p>
		<p>[2. Connexion.] Le navigateur se connecte au serveur du site RP.</p>
		<p>
			[3. Contexte.] La page est chargée à l’adresse https://bdxio2026.demo/connexion. Son origine
			est https://bdxio2026.demo : protocole, hôte et port, sans le chemin. Le RP ID demandé est
			bdxio2026.demo, le domaine auquel les credentials sont rattachés. Le navigateur détermine
			l’origine réelle de la page.
		</p>
		<p>
			[4. Demande.] Le navigateur vérifie que cette origine peut utiliser le RP ID demandé, puis
			sollicite l’authentificateur pour ce RP ID. Ici, la demande ne fournit pas de liste
			d’identifiants de credentials : les credentials découvrables permettent de retrouver le
			compte.
		</p>
		<p>
			[5. Filtrage.] L’authentificateur retrouve les credentials d’Alice et Bob rattachés à
			bdxio2026.demo. Le credential associé à autre-site.fr ne correspond pas au RP ID demandé. Le
			diagramme représente le périmètre des credentials, pas une interface réelle.
		</p>
		<p>
			[À l’oral : résistance au phishing.] Sur un faux site dont le domaine est sans relation avec
			bdxio2026.demo, le navigateur refuse une demande pour ce RP ID. Si le faux site utilise son
			propre RP ID, les passkeys du vrai site ne correspondent pas au filtre. Copier l’apparence du
			vrai site ne permet donc pas d’y utiliser ses passkeys. Les origines apparentées autorisées
			sont hors du périmètre de cette démo.
		</p>
		<p>
			La preuve reste liée au site : la signature couvre notamment l’empreinte du RP ID et, via les
			données client, l’origine et le challenge. Le serveur vérifie ces valeurs et la signature par
			rapport à sa configuration attendue. Ces contrôles complètent ceux du navigateur. Le filtrage
			illustre le périmètre du credential ; il ne remplace pas la vérification serveur.
		</p>
		<p>
			[6. Comptes.] Le navigateur peut alors proposer les comptes disponibles, ici Alice et Bob. Le
			site n’a pas besoin de savoir d’abord que je suis Alice : il retrouvera le compte à partir de
			la réponse d’authentification. C’est une possibilité, pas une obligation de supprimer le champ
			identifiant. L’interface exacte dépend du navigateur et du gestionnaire.
		</p>
		<p>
			Les clés privées restent dans l’authentificateur. Le navigateur peut donc retrouver les
			passkeys de ce site. Côté développeur, on peut encadrer leur création et leur utilisation
			grâce aux options WebAuthn.
		</p>
		<p>
			Sources : https://www.w3.org/TR/webauthn-3/#client-side-discoverable-credential et
			https://www.w3.org/TR/webauthn-3/#sctn-rp-operations
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.discovery {
		position: relative;
		width: 1800px;
		height: 820px;
		margin: 40px auto 0;
	}

	.server {
		position: absolute;
		left: 0;
		top: 0;
		width: 660px;
		height: 105px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}

	.server svg {
		width: 50px;
		height: 60px;
		fill: none;
		stroke: var(--slyd-headings-color);
		stroke-width: 2.5;
	}

	.server strong,
	.server code {
		display: block;
	}

	.server strong {
		font-size: 32px;
	}

	.server code {
		font-size: 28px;
		color: var(--atlas-muted);
		margin-top: 5px;
	}

	.connections {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
		stroke: var(--slyd-accent-color);
		stroke-width: 6;
		stroke-linecap: butt;
		stroke-linejoin: round;
	}

	.visit {
		position: absolute;
		left: 355px;
		top: 113px;
		margin: 0;
		font-size: 27px;
		color: var(--atlas-muted);
	}

	.browser {
		position: absolute;
		left: 0;
		top: 190px;
		width: 660px;
		height: 660px;
		box-sizing: border-box;
		border: 2px solid var(--slyd-headings-color);
		border-radius: 10px;
		overflow: hidden;
		background: var(--slyd-slide-bg-color);
	}

	.browser-tabs {
		display: flex;
		align-items: center;
		gap: 20px;
		height: 48px;
		padding: 0 18px;
		background: #dfe9e2;
		border-bottom: 1px solid var(--atlas-rule);
	}

	.window-controls {
		display: flex;
		gap: 8px;
	}

	.window-controls i {
		width: 10px;
		height: 10px;
		border: 2px solid #6c837b;
		border-radius: 50%;
	}

	.active-tab {
		display: flex;
		align-items: center;
		justify-content: space-between;
		align-self: end;
		width: 210px;
		padding: 8px 16px;
		border-radius: 8px 8px 0 0;
		background: var(--slyd-slide-bg-color);
		font-size: 20px;
	}

	.active-tab span,
	.new-tab {
		font-size: 25px;
		color: var(--atlas-muted);
	}

	.browser-bar {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		border-bottom: 2px solid var(--atlas-rule);
		background: var(--slyd-slide-bg-color);
	}

	.browser-navigation {
		width: 78px;
		height: 24px;
		flex-shrink: 0;
		fill: none;
		stroke: var(--atlas-muted);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.address {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		padding: 9px 12px;
		border: 1px solid var(--atlas-rule);
		border-radius: 22px;
		background: var(--atlas-tint);
	}

	.address svg {
		width: 16px;
		height: 20px;
		flex-shrink: 0;
		fill: none;
		stroke: var(--slyd-accent-color);
		stroke-width: 2;
	}

	.browser-bar code {
		font-size: 21px;
		white-space: nowrap;
	}

	.browser-body {
		padding: 26px 28px;
	}

	h4 {
		margin: 0;
		font-size: 34px;
		color: var(--slyd-headings-color);
	}

	h4 small {
		display: block;
		margin: 5px 0 0 49px;
		font-size: 24px;
		color: var(--atlas-muted);
		font-weight: 400;
	}

	.step {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		border-radius: 50%;
		background: var(--slyd-accent-color);
		color: white;
		font-size: 24px;
		font-weight: 700;
		margin-right: 8px;
		vertical-align: middle;
	}

	.context-heading {
		margin: 18px 0 0;
		font-size: 29px;
		line-height: 1.3;
		color: var(--slyd-headings-color);
	}

	dl {
		margin: 12px 0 0;
	}

	dl > div + div {
		margin-top: 17px;
	}

	dt {
		font-size: 23px;
		color: var(--atlas-muted);
	}

	dd {
		margin: 3px 0 0;
		font-size: 29px;
	}

	.validation {
		margin: 20px 0 0;
		color: var(--slyd-accent-color);
		font-size: 25px;
		font-weight: 600;
	}

	.accounts {
		display: flex;
		gap: 16px;
		margin-top: 20px;
	}

	.accounts span {
		padding: 6px 35px;
		border: 2px solid var(--slyd-accent-color);
		border-radius: 4px;
		font-size: 27px;
		color: var(--slyd-accent-color);
		background: var(--atlas-tint);
	}

	.request {
		position: absolute;
		left: 695px;
		top: 245px;
		width: 470px;
		text-align: center;
		font-size: 31px;
	}

	.request p {
		margin: 0 0 10px;
	}

	.request code {
		font-size: 29px;
		color: var(--slyd-accent-color);
	}

	.authenticator {
		position: absolute;
		left: 1190px;
		top: 190px;
		width: 610px;
		box-sizing: border-box;
		padding: 26px;
		border: 2px solid var(--slyd-headings-color);
		border-radius: 10px;
	}

	.filter {
		font-size: 28px;
		margin: 16px 0 22px;
		color: var(--slyd-accent-color);
	}

	.credential {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 16px 18px;
		border: 2px solid var(--atlas-rule);
		border-radius: 4px;
	}

	.credential + .credential {
		margin-top: 14px;
	}

	.credential strong {
		display: block;
		font-size: 29px;
	}

	.credential code {
		display: block;
		font-size: 26px;
		margin-top: 3px;
	}

	.key {
		width: 64px;
		height: 32px;
		flex-shrink: 0;
		fill: none;
		stroke: currentColor;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.status {
		margin-left: auto;
		font-size: 32px;
	}

	.result {
		position: absolute;
		left: 695px;
		top: 560px;
		width: 470px;
		text-align: center;
		font-size: 29px;
		color: var(--slyd-accent-color);
	}
</style>
