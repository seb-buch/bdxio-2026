<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import phoneIcon from '#lib/assets/icons/material/smartphone.svg';
	import managerIcon from '#lib/assets/icons/material/web.svg';
	import keyIcon from '#lib/assets/icons/material/vpn-key.svg';
	import safeIcon from '#lib/assets/icons/material/lock.svg';

	const icons = { phone: phoneIcon, manager: managerIcon, key: keyIcon, safe: safeIcon };
</script>

{#snippet icon(kind: keyof typeof icons)}
	<span class="icon" style:mask-image={`url("${icons[kind]}")`} aria-hidden="true"></span>
{/snippet}

<Slide>
	<h3>Et si je perds mes passkeys ?</h3>
	<div class="comparison">
		<section class="limit">
			<p class="eyebrow">La limite</p>
			<h4>Plus de passkey accessible…</h4>
			<div class="blocked-path" aria-label="Tous les supports indisponibles : accès au site bloqué">
				<div class="lost-devices">
					<span>{@render icon('phone')}</span>
					<span>{@render icon('manager')}</span>
					<span>{@render icon('key')}</span>
				</div>
			</div>
			<p class="result">… plus d’accès au compte.</p>
		</section>

		<section class="precaution fragment" data-fragment-index="0">
			<p class="eyebrow">La précaution</p>
			<h4>Un compte, plusieurs passkeys distinctes</h4>
			<div class="supports">
				<div>{@render icon('phone')}<strong>Gestionnaire A</strong></div>
				<span class="plus" aria-hidden="true">+</span>
				<div>{@render icon('manager')}<strong>Gestionnaire B</strong></div>
				<span class="plus" aria-hidden="true">+</span>
				<div>{@render icon('key')}<strong>Clé de sécurité</strong></div>
			</div>
			<p class="principle">Des supports ou gestionnaires indépendants</p>
		</section>
	</div>

	<p class="takeaway fragment" data-fragment-index="1">Ne pas dépendre d’une seule passkey.</p>

	<section
		class="backup fragment"
		data-fragment-index="2"
		aria-label="Exemple d’un support de passkeys au quotidien et d’un support de secours"
	>
		<div class="example-label">Exemple concret<br /><strong>Deux supports de passkeys</strong></div>
		<div class="backup-key">
			{@render icon('manager')}
			<div><strong>Au quotidien</strong><span>Le support habituel</span></div>
		</div>
		<span class="plus" aria-hidden="true">+</span>
		<div class="backup-key">
			{@render icon('safe')}
			<div><strong>En lieu sûr</strong><span>Un support de secours indépendant</span></div>
		</div>
	</section>

	<SpeakerNotes>
		<p>
			Nous avons démontré l’authentification sans mot de passe et sans secret partagé avec le
			serveur. La clé privée reste bien un secret. La limite pratique est la disponibilité de nos
			passkeys : si elles sont toutes inaccessibles, nous ne pouvons plus nous authentifier par
			passkey. Un éventuel autre accès dépend des moyens prévus par le service ; nous ne détaillons
			pas ici la récupération du compte.
		</p>
		<p>
			[La précaution.] Enregistrer plusieurs passkeys distinctes pour le même compte, sur des
			supports ou gestionnaires indépendants. Plusieurs appareils synchronisés peuvent contenir la
			même passkey et dépendent alors du même gestionnaire. Le nombre d’appareils ou de credentials
			ne suffit donc pas : il faut éviter qu’une même perte d’accès les affecte tous. Les trois
			supports dessinés sont des exemples, pas une obligation d’en avoir trois.
		</p>
		<p>
			[Conclusion.] Ne pas dépendre d’une seule passkey : diversifier ses moyens d’accès pour
			réduire le risque de les perdre tous ensemble.
		</p>
		<p>
			[L’exemple.] Un support utilisé au quotidien et un support de secours indépendant, physique ou
			logiciel, dont l’accès est préservé en lieu sûr. Les passkeys nécessaires doivent avoir été
			enregistrées pour les mêmes comptes sur les deux supports ; ce point est expliqué à l’oral.
			Deux gestionnaires dépendant du même accès ne constituent pas nécessairement deux secours
			indépendants.
		</p>
		<p>
			Yubico illustre cette précaution avec une clé principale et une clé de secours, déjà
			enregistrée auprès des mêmes services et conservée en lieu sûr, par exemple dans un coffre.
			Chaque clé possède son propre credential ; il ne s’agit pas de copier la clé privée de la
			première YubiKey sur la seconde. Ce principe s’étend à d’autres supports et gestionnaires.
		</p>
		<p>
			Sources : https://www.yubico.com/products/spare/ et
			https://docs.yubico.com/software/yubikey/tools/authenticator/auth-guide/tips.html#passkeys
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.comparison {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: 36px;
		margin-top: 44px;
		text-align: left;
	}

	.comparison section {
		padding: 28px 32px;
		border-top: 5px solid currentColor;
	}

	.limit {
		color: #a14e32;
		background: #fbefe8;
	}

	.precaution {
		color: #086b63;
		background: #edf4ee;
	}

	.eyebrow {
		font-size: 23px;
		margin: 0 0 12px;
		font-weight: 700;
	}

	h4 {
		font-size: 34px;
		line-height: 1.25;
		margin: 0;
		color: var(--slyd-headings-color);
	}

	.icon {
		display: block;
		background-color: currentColor;
		mask-size: contain;
		mask-position: center;
		mask-repeat: no-repeat;
		width: 80px;
		height: 80px;
		flex-shrink: 0;
	}

	.blocked-path {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		height: 180px;
	}

	.lost-devices {
		display: flex;
		gap: 44px;
		opacity: 0.5;
	}

	.lost-devices > span {
		position: relative;
	}

	.lost-devices > span::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 4px;
		background: currentColor;
		transform: rotate(-45deg);
	}

	.lost-devices .icon {
		width: 80px;
		height: 80px;
	}

	.result {
		font-size: 31px;
		font-weight: 700;
		margin: 0;
	}

	.supports {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		height: 180px;
	}

	.supports > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		flex: 1;
	}

	.supports strong {
		font-size: 23px;
		color: var(--slyd-headings-color);
		text-align: center;
	}

	.plus {
		font-size: 36px;
		color: var(--atlas-muted);
	}

	.principle {
		margin: 0;
		font-size: 29px;
		font-weight: 600;
		text-align: center;
	}

	.backup {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 28px 0;
		margin-top: 30px;
		border-top: 2px solid var(--atlas-rule);
		border-bottom: 2px solid var(--atlas-rule);
		text-align: left;
	}

	.example-label {
		font-size: 23px;
		color: var(--atlas-muted);
	}

	.example-label strong {
		font-size: 25px;
		color: var(--slyd-headings-color);
	}

	.backup-key {
		display: flex;
		align-items: center;
		gap: 18px;
		color: var(--slyd-accent-color);
	}

	.backup-key strong {
		display: block;
		font-size: 28px;
	}

	.backup-key span {
		display: block;
		font-size: 22px;
		color: var(--atlas-muted);
	}

	.takeaway {
		margin: 1em 0;
		font-size: 1.6em;
		font-weight: 700;
		color: var(--slyd-accent-color);
		text-align: center;
	}
</style>
