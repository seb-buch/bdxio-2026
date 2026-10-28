<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import FlowDiagram from '#lib/common/FlowDiagram.svelte';
	import { authenticationFlow } from '../passkey-flows';
	import CodeExample from './CodeExample.svelte';
	import pointerIcon from './pointer.svg';
	import type { CodeLocation } from './code-slide';
	import type {
		AuthenticationTransition,
		AuthenticationTransitionExample
	} from './authentication-transition';

	let { transitions }: { transitions: AuthenticationTransitionExample[] } = $props();

	// Insertion du traitement local entre la demande et le retour des options.
	const flowDiagram = {
		...authenticationFlow,
		id: 'authentication-implementation',
		steps: [
			authenticationFlow.steps[0],
			{ location: 2, label: 'Génération des options' },
			...authenticationFlow.steps.slice(1)
		]
	};

	const transitionDefinitions = {
		'request-options': { row: 0, from: 1, to: 2, location: 'browser' },
		'generate-options': { row: 1, from: 2, to: 2, location: 'server' },
		'return-options': { row: 2, from: 2, to: 1, location: 'dto' },
		'get-credential': { row: 3, from: 1, to: 1, location: 'browser' },
		'request-signature': { row: 4, from: 1, to: 0, location: 'browser' },
		'sign-challenge': { row: 5, from: 0, to: 0, location: 'browser' },
		'return-signature': { row: 6, from: 0, to: 1, location: 'browser' },
		'return-credential': { row: 7, from: 1, to: 2, location: 'dto' },
		'verify-authentication': { row: 8, from: 2, to: 2, location: 'server' },
		'authentication-complete': { row: 9, from: 2, to: 1, location: 'dto' }
	} satisfies Record<
		AuthenticationTransition,
		{
			row: number;
			from: number;
			to: number;
			location: CodeLocation;
		}
	>;

	const stepHeight = 38;
	const streamWidth = 300;
	const headerHeight = 80;
	const diagramHeight = headerHeight + flowDiagram.steps.length * stepHeight + 5;
</script>

<Slide>
	<h3>Cérémonie d’authentification</h3>
	<div class="authentication-flow">
		<FlowDiagram {flowDiagram} useFragment={false} stepIndices={[]} diagramStyle={{ stepHeight }} />
		{#each transitions as example, index (index)}
			{@const definition = transitionDefinitions[example.transition]}
			{@const isExchange = definition.from !== definition.to}
			{@const previousRow =
				index > 0 ? transitionDefinitions[transitions[index - 1].transition].row : definition.row}
			<div class="transition-step fragment custom" class:exchange={isExchange}>
				<div class="diagram-step">
					<FlowDiagram
						flowDiagram={{ ...flowDiagram, id: `${flowDiagram.id}-${index}` }}
						useFragment={false}
						showActors={false}
						stepIndices={[definition.row]}
						diagramStyle={{ stepHeight }}
					/>
				</div>
				{#if isExchange}<span class="movement fragment custom" aria-hidden="true"></span>{/if}
				<svg class="cursor" viewBox="0 0 900 {diagramHeight}" aria-hidden="true">
					<image
						href={pointerIcon}
						x={(definition.to + 0.5) * streamWidth - 12}
						y={headerHeight + (definition.row + 0.5) * stepHeight - 32}
						width="24"
						height="30"
						style:--travel-x="{(definition.from - definition.to) * streamWidth}px"
						style:--travel-y="{(previousRow - definition.row) * stepHeight}px"
					/>
				</svg>
				{#if example.codeSnippet !== undefined}
					<CodeExample
						contentKey={example.codeSnippet}
						description={flowDiagram.steps[definition.row].label}
						location={definition.location}
						highlightedLines={example.highlightedLines}
					>
						{example.codeSnippet}
					</CodeExample>
				{/if}
			</div>
		{/each}
	</div>
	<SpeakerNotes>
		<p>
			Le serveur retrouve le compte et ses passkeys, puis génère un nouveau challenge. Il conserve
			ce challenge avec le compte dans une cérémonie en attente ; la clé publique reste côté
			serveur.
		</p>
		<p>
			Les options indiquent le site et les credentials autorisés. Le navigateur les transmet à
			navigator.credentials.get directement. Après autorisation de l’utilisateur, l’authentificateur
			signe avec la clé privée des données liées au challenge et au contexte du site.
		</p>
		<p>
			La réponse contient l’identifiant du credential, clientDataJSON, authenticatorData et la
			signature. La clé privée n’est jamais envoyée au serveur.
		</p>
		<p>
			Le serveur consomme le challenge attendu et retrouve la clé publique du credential pour ce
			compte. Il vérifie la signature, le challenge, l’origine, le RP ID et la présence utilisateur
			avant d’ouvrir la session.
		</p>
		<p>
			Le compteur WebAuthn est distinct du compteur temporel TOTP. Certaines passkeys synchronisées
			gardent un compteur nul : ici, le challenge à usage unique protège contre le rejeu d’une
			ancienne réponse.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.authentication-flow {
		position: relative;
		width: 1500px;
		max-width: 100%;
		margin: 40px auto 0;
	}
	.diagram-step,
	.cursor {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.cursor image {
		transform: translate(var(--travel-x), var(--travel-y));
		transition: transform 1s ease;
	}
	.transition-step {
		height: 0;
		visibility: hidden;
	}
	.movement {
		display: none;
	}
	.transition-step:global(.revealed) {
		visibility: visible;
	}
	/* À l’apparition de la ligne, descendre depuis la précédente avant de suivre la flèche. */
	.transition-step.exchange:global(.revealed) .cursor image {
		transform: translate(var(--travel-x), 0);
	}
	.transition-step:not(.exchange):global(.revealed) .cursor image,
	.transition-step:has(.movement:global(.revealed)) .cursor image {
		transform: translate(0, 0);
	}
	/* Le diagramme reste construit ; seul le curseur et le code précédents disparaissent. */
	.transition-step:has(~ .transition-step:global(.revealed)) .cursor,
	.transition-step:has(~ .transition-step:global(.revealed)) :global(.code-container) {
		visibility: hidden;
		pointer-events: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.cursor image {
			transition: none;
		}
	}
</style>
