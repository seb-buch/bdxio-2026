<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import FlowDiagram from '#lib/common/FlowDiagram.svelte';
	import { registrationFlow } from '../passkey-flows';
	import CodeExample from './CodeExample.svelte';
	import pointerIcon from './pointer.svg';
	import type { CodeLocation } from './code-slide';
	import type {
		RegistrationTransition,
		RegistrationTransitionExample
	} from './registration-transition';

	let { transitions }: { transitions: RegistrationTransitionExample[] } = $props();

	// Insertion du traitement local entre la demande et le retour des options.
	const flowDiagram = {
		...registrationFlow,
		id: 'registration-implementation',
		steps: [
			registrationFlow.steps[0],
			{ location: 2, label: 'Génération des options' },
			...registrationFlow.steps.slice(1)
		]
	};

	const transitionDefinitions = {
		'request-options': { row: 0, from: 1, to: 2, location: 'browser' },
		'generate-options': { row: 1, from: 2, to: 2, location: 'server' },
		'return-options': { row: 2, from: 2, to: 1, location: 'dto' },
		'create-credential': { row: 3, from: 1, to: 1, location: 'browser' },
		'request-creation': { row: 4, from: 1, to: 0, location: 'browser' },
		'generate-key-pair': { row: 5, from: 0, to: 0, location: 'browser' },
		'return-public-key': { row: 6, from: 0, to: 1, location: 'browser' },
		'return-credential': { row: 7, from: 1, to: 2, location: 'dto' },
		'verify-registration': { row: 8, from: 2, to: 2, location: 'server' },
		'registration-complete': { row: 9, from: 2, to: 1, location: 'dto' }
	} satisfies Record<
		RegistrationTransition,
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
	<h3>Cérémonie d’enregistrement</h3>
	<div class="registration-flow">
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
			On part d’une session ouverte. Le navigateur demande des options au serveur, qui prépare un
			challenge aléatoire et le conserve avec le compte et la cérémonie en attente.
		</p>
		<p>
			Les options précisent le site, le compte et les conditions de création. Dans notre démo, on
			demande un credential découvrable et une vérification locale préférée, sans la rendre
			obligatoire.
		</p>
		<p>
			Le navigateur appelle directement navigator.credentials.create(). L’authentificateur crée la
			paire de clés après autorisation de l’utilisateur. La clé privée reste dans le gestionnaire de
			passkeys.
		</p>
		<p>
			La réponse revient au serveur. Celui-ci vérifie notamment le challenge, l’origine, le RP ID et
			la présence utilisateur avant d’enregistrer le credential et sa clé publique. Le challenge est
			consommé une seule fois.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.registration-flow {
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
