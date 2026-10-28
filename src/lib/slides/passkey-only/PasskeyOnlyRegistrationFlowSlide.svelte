<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import FlowDiagram from '#lib/common/FlowDiagram.svelte';
	import authenticatorIcon from '#lib/common/images/authenticator.png';
	import browserIcon from '#lib/common/images/browser.png';
	import serverIcon from '#lib/common/images/backend.png';

	const signup = {
		id: 'passkey-only-signup',
		title: 'Création du compte et de sa passkey',
		streamLines: [
			{ name: 'Authentificateur', iconPath: authenticatorIcon },
			{ name: 'Navigateur', iconPath: browserIcon },
			{ name: 'Serveur', iconPath: serverIcon }
		],
		steps: [
			{ from: 1, to: 2, label: 'Informations du nouveau compte' },
			{ from: 2, to: 1, label: 'Challenge + identifiant du futur compte' },
			{ from: 1, to: 0, label: 'Créer une passkey pour ce site' },
			{ location: 0, label: 'Autorisation + paire de clés' },
			{ from: 0, to: 1, label: 'ID du credential + clé publique + réponse' },
			{ from: 1, to: 2, label: 'Réponse d’enregistrement' },
			{ location: 2, label: 'Vérifier · Créer le compte + credential' },
			{ from: 2, to: 1, label: 'Création du compte ✔' }
		]
	};
</script>

<Slide>
	<h3>Passkey et compte créés ensemble</h3>
	<div class="flow">
		<FlowDiagram flowDiagram={signup} diagramStyle={{ stepHeight: 48 }} />
	</div>
	<SpeakerNotes
		><p>
			La cérémonie ressemble à l’ajout d’une passkey, mais il n’y a pas encore de compte
			authentifié. Le navigateur transmet les informations du nouveau compte. Le serveur vérifie que
			l’identifiant est disponible et prépare un challenge avec un identifiant interne pour le futur
			compte.
		</p>
		<p>
			L’authentificateur crée une passkey découvrable pour ce site après mon autorisation. Le
			navigateur transmet la réponse d’enregistrement, qui contient notamment l’identifiant du
			credential et la clé publique.
		</p>
		<p>
			Le serveur vérifie le challenge, le site et la présence utilisateur. C’est seulement après
			cette vérification qu’il enregistre ensemble le compte et son credential, dans une
			transaction. Le compte ne passe jamais par un état où un mot de passe lui aurait été attribué.
		</p>
		<p>
			Cette inscription crée un compte, pas une identité civile vérifiée : les informations saisies
			sont celles de l’utilisateur. La connexion suivante prouvera la possession de la passkey
			associée à ce compte.
		</p></SpeakerNotes
	>
</Slide>

<style>
	.flow {
		max-width: 1350px;
		margin: 40px auto 0;
	}
</style>
