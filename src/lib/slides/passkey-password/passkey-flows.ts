import type { ComponentProps } from 'svelte';
import FlowDiagram from '#lib/common/FlowDiagram.svelte';
import browserIcon from '#lib/common/images/browser.png';
import authenticator from '#lib/common/images/authenticator.png';
import serverIcon from '#lib/common/images/backend.png';

const streamLines = [
	{ iconPath: authenticator, name: 'Authenticator' },
	{ iconPath: browserIcon, name: 'Client' },
	{ iconPath: serverIcon, name: 'Relying Party' }
];

export const registrationFlow = {
	id: 'registration-flow',
	title: 'Diagramme de la cérémonie de création',
	streamLines,
	steps: [
		{ from: 1, to: 2, label: "Options d'enregistrement ?" },
		{ from: 2, to: 1, label: 'Challenge + options' },
		{ location: 1, label: 'navigator.credentials.create()' },
		{ from: 1, to: 0, label: 'Demande de création' },
		{ location: 0, label: 'Génération paire de clés + passkey' },
		{ from: 0, to: 1, label: 'Clé publique + ID passkey + ...' },
		{ from: 1, to: 2, label: 'Clé publique + ID passkey + ...' },
		{ location: 2, label: 'Vérif. challenge + enreg. passkey' },
		{ from: 2, to: 1, label: '✔ Enregistrement réussi' }
	]
} satisfies ComponentProps<typeof FlowDiagram>['flowDiagram'];

export const authenticationFlow = {
	id: 'authentication-flow',
	title: 'Diagramme de la cérémonie de connexion',
	streamLines,
	steps: [
		{ from: 1, to: 2, label: "Options d'authentification ?" },
		{ from: 2, to: 1, label: 'Challenge + options' },
		{ location: 1, label: 'navigator.credentials.get()' },
		{ from: 1, to: 0, label: 'Demande de signature' },
		{ location: 0, label: 'Présence + signature' },
		{ from: 0, to: 1, label: 'Signature + ID passkey + ...' },
		{ from: 1, to: 2, label: 'Signature + ID passkey + ...' },
		{ location: 2, label: 'Vérif. challenge + signature' },
		{ from: 2, to: 1, label: '✔ Authentification réussie' }
	]
} satisfies ComponentProps<typeof FlowDiagram>['flowDiagram'];
