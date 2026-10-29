<script>
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import FlowDiagram from '#lib/common/FlowDiagram.svelte';
	import browserIcon from '#lib/common/images/browser.png';
	import authenticatorIcon from '#lib/common/images/authenticator.png';
	import serverIcon from '#lib/common/images/backend.png';

	const flow = {
		id: 'cross-device',
		title: 'Connexion sur un ordinateur avec une passkey du téléphone',
		streamLines: [
			{ name: 'Téléphone', iconPath: authenticatorIcon },
			{ name: 'Navigateur sur l’ordinateur', iconPath: browserIcon },
			{ name: 'Serveur BDX I/O 2026 démo', iconPath: serverIcon }
		],
		steps: [
			{ from: 1, to: 2, label: "Demande options d'authentification" },
			{ from: 2, to: 1, label: 'Challenge + options WebAuthn' },
			{ location: 1, label: 'Utilisation authentificateur tiers' },
			{ from: 1, to: 0, label: 'QR code + vérification de proximité' },
			{ location: 0, label: 'Autorisation locale + signature' },
			{ from: 0, to: 1, label: 'Réponse signée' },
			{ from: 1, to: 2, label: 'Réponse WebAuthn' },
			{ from: 2, to: 1, label: 'Ouverture de session sur l’ordinateur' }
		]
	};
</script>

<Slide>
	<h3>Se connecter sur ordinateur avec son téléphone</h3>
	<div class="flow">
		<FlowDiagram flowDiagram={flow} diagramStyle={{ stepHeight: 60, streamWidth: 350 }} />
	</div>
	<SpeakerNotes>
		<p>
			Après avoir créé le compte avec une passkey sur l’ordinateur, ajouter un autre credential en
			choisissant le téléphone dans l’interface système. Vérifier que deux identifiants différents
			apparaissent. Des appareils synchronisés peuvent déjà partager le même credential : choisir
			des fournisseurs distincts pour la répétition si nécessaire.
		</p>
		<p>
			Se déconnecter, lancer la connexion et choisir explicitement un autre appareil. Scanner le QR
			code avec le téléphone et autoriser l’utilisation de sa passkey. L’application reste ouverte
			sur l’ordinateur, le téléphone sert d’authentificateur.
		</p>
		<p>
			Le dessin simplifie le transport hybride CTAP. Le QR code amorce le dialogue et Bluetooth Low
			Energy sert à vérifier la proximité. Les échanges utilisent un canal chiffré pouvant passer
			par un service de relais sur Internet. La passkey n’est pas transférée par Bluetooth ni copiée
			sur l’ordinateur par cette connexion.
		</p>
		<p>
			Ce flux ne synchronise pas les passkeys. Le fournisseur du téléphone peut avoir sa propre
			synchronisation, distincte de cette utilisation cross-device. Les options WebAuthn et leur
			vérification côté serveur restent les mêmes.
		</p>
		<p>
			Depuis la session ouverte grâce au téléphone, retirer le credential de l’ordinateur. Se
			déconnecter et tester une nouvelle connexion avec l’ancien credential : il doit être refusé.
			Le gestionnaire peut encore le proposer. Revenir ensuite avec le téléphone. Le retrait côté
			serveur n’efface pas automatiquement la copie du gestionnaire et ne ferme pas les sessions
			déjà ouvertes.
		</p>
		<p>
			Préparation : Bluetooth et réseau disponibles, deux credentials distincts, certificat local
			approuvé sur l’ordinateur. Le téléphone n’a pas besoin de charger le site pour ce flux
			hybride. Répéter sur le couple navigateur et OS utilisé le jour de la présentation.
		</p>
		<p>
			Sources :
			https://www.passkeycentral.org/launch-and-grow/troubleshooting-guidance/cross-device-sign-in
			et https://fidoalliance.org/passkeys/
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.flow {
		width: 1400px;
		margin: 25px auto 0;
	}
</style>
