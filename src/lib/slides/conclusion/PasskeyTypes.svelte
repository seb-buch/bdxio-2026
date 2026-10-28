<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Et si je perds mon téléphone ?</h3>
	<table aria-label="Passkeys liées à un appareil et passkeys synchronisées">
		<thead>
			<tr>
				<th scope="col">Passkey</th>
				<th scope="col">Liée à un appareil</th>
				<th scope="col">Synchronisée</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">Où est la clé privée ?</th>
				<td>Dans un seul authentificateur</td>
				<td
					>Disponible sur plusieurs appareils via un gestionnaire, synchronisée sous forme chiffrée
				</td>
			</tr>
			<tr>
				<th scope="row">Si je perds cet appareil ?</th>
				<td>Cette passkey devient indisponible</td>
				<td
					>Elle peut rester accessible sur un autre appareil ou être restaurée via le gestionnaire
				</td>
			</tr>
			<tr>
				<th scope="row">De quoi dépend mon accès ?</th>
				<td>D’une autre passkey déjà enregistrée ou de la récupération du compte</td>
				<td>De l’accès au gestionnaire et de ses mécanismes de récupération</td>
			</tr>
		</tbody>
	</table>

	<SpeakerNotes>
		<p>
			Nous venons d’enregistrer deux passkeys distinctes. Perdre une passkey ne signifie donc pas
			forcément perdre l’accès au compte : l’autre peut encore servir à se connecter. Si je perds
			mon téléphone, le sort de sa passkey dépend de son stockage. Une passkey liée à un appareil
			reste dans un seul authentificateur, par exemple une clé de sécurité matérielle. La perdre
			rend cette passkey indisponible, sans nécessairement perdre tout accès au compte si une autre
			passkey est déjà enregistrée.
		</p>
		<p>
			Une passkey synchronisée peut être disponible sur plusieurs appareils via un gestionnaire,
			comme iCloud Keychain, Google Password Manager ou un fournisseur tiers. La synchronisation est
			chiffrée. Retrouver ses passkeys dépend de l’accès à ce gestionnaire et de ses mécanismes de
			récupération.
		</p>
		<p>
			Deux appareils synchronisés peuvent contenir la même passkey. Enregistrer une seconde passkey,
			par exemple sur une clé de sécurité, crée un autre credential : c’est une autre forme de
			secours. Une passkey liée à un appareil peut aussi servir depuis un autre ordinateur en y
			branchant la clé, ou via une authentification inter-appareils. Cela ne la synchronise pas.
		</p>
		<p>
			Le paramètre authenticatorAttachment décrit un autre axe : platform pour un authentificateur
			intégré, cross-platform pour un authentificateur externe. Il ne détermine pas si la passkey
			est synchronisée. Une passkey liée à un appareil n’implique pas non plus, à elle seule, un
			stockage matériel particulier.
		</p>
		<p>
			Perdre son téléphone ne signifie donc pas toujours perdre sa passkey. Mais si je perds l’accès
			à tous mes appareils et à mon gestionnaire, comment récupérer mon compte ?
		</p>
		<p>
			Sources : https://fidoalliance.org/passkeys/ et
			https://www.w3.org/TR/webauthn-3/#sctn-authenticator-attachment
		</p>
	</SpeakerNotes>
</Slide>

<style>
	table {
		width: 100%;
		margin-top: 64px;
		table-layout: fixed;
		border-collapse: collapse;
		text-align: left;
		font-size: 34px;
	}

	th,
	td {
		padding: 28px 24px;
		border-bottom: 1px solid #d3dce8;
		vertical-align: top;
	}

	thead th {
		color: var(--slyd-headings-color);
		border-bottom: 3px solid var(--slyd-accent-color);
	}

	th:first-child {
		width: 23%;
	}
</style>
