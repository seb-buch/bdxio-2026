<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Au fait, c'est quoi une <em>Passkey</em>&nbsp;?</h3>
	<ul class="w3c-terms">
		<li class="important">Passkey</li>
		<li>Client-side discoverable Public Key Credential Source</li>
		<li>Client-side discoverable Credential</li>
		<li>Discoverable Credential</li>
		<li><span class="deprecated">Resident Credential</span></li>
		<li><span class="deprecated">Resident Key</span></li>
	</ul>
	<p class="w3c-definition">
		<b>A Client-side discoverable Public Key Credential Source</b> [&hellip;] is a public key
		credential source that is discoverable and
		<b
			>usable in authentication ceremonies where the Relying Party does not provide any credential
			IDs</b
		>, i.e., the Relying Party invokes <code>navigator.credentials.get()</code> with an empty
		allowCredentials argument. This means that the Relying Party does not necessarily need to first
		identify the user.<br />
		<br />
		As a consequence, a discoverable credential capable
		<b
			>authenticator can generate an assertion signature for a discoverable credential given only an
			RP ID</b
		>, which in turn
		<b
			>necessitates that the public key credential source is stored in the authenticator or client
			platform</b
		>. This is in contrast to a Server-side Public Key Credential Source, which requires that the
		authenticator is given both the RP ID and the credential ID but does not require client-side
		storage of the public key credential source.
	</p>

	<p class="w3c-link">
		Source&nbsp;:
		<a
			href="https://w3c.github.io/webauthn/#client-side-discoverable-credential"
			target="_blank"
			rel="noreferrer">W3C — Spécification WebAuthn</a
		>
	</p>

	<p class="de-facto-definition fragment">
		Une <em>passkey</em> est un credential <strong>WebAuthn découvrable</strong>, associé à un
		compte et à un site, qui permet de s’authentifier avec une paire de clés.
	</p>
	<SpeakerNotes>
		<p>
			Mais au fait, c’est quoi une passkey ? On rencontre plusieurs noms pour cette notion, dont les
			anciens termes Resident Credential et Resident Key.
		</p>
		<p>
			Voici la définition du W3C pour un credential découvrable côté client. C’est en anglais, c’est
			long, et on ne va pas la lire ensemble. L’idée essentielle est que l’authentificateur peut
			retrouver le credential pour un site sans que le serveur lui fournisse d’abord son
			identifiant.
		</p>
		<p>
			[Définition pratique.] Une passkey, c’est un credential WebAuthn découvrable, associé à un
			compte et à un site, qui permet de s’authentifier avec une paire de clés. La clé privée sert à
			signer et la clé publique à vérifier.
		</p>
		<p>
			Découvrable signifie que le navigateur et l’authentificateur peuvent proposer les comptes
			disponibles pour le site avant que l’utilisateur saisisse son identifiant. Cela ne veut pas
			dire que la clé privée est publique.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.w3c-terms {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		list-style: none;
		margin: 38px 24px 0;
		padding: 0;
		font-size: 26px;
		line-height: 1.4;
		font-weight: 600;
	}

	.w3c-terms li:not(:first-child)::before {
		content: 'ou';
		padding-right: 12px;
		color: var(--atlas-muted);
		font-size: 22px;
		font-weight: 400;
	}

	.deprecated {
		text-decoration: line-through;
	}

	.important {
		color: var(--slyd-accent-color);
		text-decoration: underline;
	}

	.w3c-definition {
		margin: 38px 24px 12px;
		padding: 24px 30px;
		border-radius: 24px;
		background: #edf4ee;
		font-size: 27px;
		font-style: italic;
		line-height: 1.45;
	}

	.w3c-link {
		margin: 0 24px;
		font-size: 24px;
		text-align: right;
	}

	.de-facto-definition {
		margin: 44px 55px 0;
		font-size: 42px;
		line-height: 1.4;
		font-weight: 600;
		text-align: center;
	}

	.de-facto-definition strong {
		color: var(--slyd-accent-color);
	}
</style>
