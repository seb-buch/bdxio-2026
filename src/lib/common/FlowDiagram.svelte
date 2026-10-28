<script lang="ts">
	type StreamLine = {
		iconPath: string;
		name: string;
	};

	type Style = {
		streamWidth: number;
		stepHeight: number;
		streamHeaderLineHeight: number;
		streamHeaderIconSize: number;
	};
	const defaultStyle: Style = {
		streamWidth: 300,
		stepHeight: 60,
		streamHeaderLineHeight: 40,
		streamHeaderIconSize: 40
	};

	type CommunicationStep = {
		from: number;
		to: number;
		label: string;
	};

	type ComputeStep = {
		location: number;
		label: string;
	};

	type flowStep = CommunicationStep | ComputeStep;

	type FlowDiagramDefinition = {
		id: string;
		title: string;
		streamLines: StreamLine[];
		steps: flowStep[];
	};

	type Props = {
		flowDiagram: FlowDiagramDefinition;
		diagramStyle?: Partial<Style>;
		useFragment?: boolean;
		fragmentOffset?: number;
		showActors?: boolean;
		stepIndices?: number[];
	};

	const {
		flowDiagram,
		diagramStyle = {},
		useFragment = true,
		fragmentOffset = 0,
		showActors = true,
		stepIndices
	}: Props = $props();
	const style: Style = $derived({ ...defaultStyle, ...diagramStyle });

	const headerHeight = $derived(style.streamHeaderLineHeight + style.streamHeaderIconSize);
	const arrowId = $derived(`arrow-head-${flowDiagram.id}`);

	function computeViewBox(flowDiagram: FlowDiagramDefinition): string {
		const width = style.streamWidth * flowDiagram.streamLines.length;
		const height = headerHeight + style.stepHeight * flowDiagram.steps.length + 5;
		return `0 0 ${width} ${height}`;
	}

	function computeY(index: number): number {
		return headerHeight + (index + 0.5) * style.stepHeight;
	}

	function computeBoundingBox(
		index: number,
		step: ComputeStep
	): {
		startX: number;
		startY: number;
		width: number;
		height: number;
	} {
		const textWidth = step.label.length * 7;
		const textHeight = 14;
		const width = textWidth + 24;
		const height = textHeight + 12;
		const startX = (step.location + 0.5) * style.streamWidth - width / 2;
		const startY = computeY(index) - height / 2;
		return { startX, startY, width, height };
	}
</script>

<svg viewBox={computeViewBox(flowDiagram)} class="diagram" aria-label={flowDiagram.title}>
	<defs>
		<marker
			id={arrowId}
			markerWidth="8"
			markerHeight="6"
			refX="7"
			refY="3"
			orient="auto"
			fill="context-stroke"
		>
			<polygon points="0 0, 8 3, 0 6" />
		</marker>
	</defs>

	{#if showActors}
		{#each flowDiagram.streamLines as streamLine, index (index)}
			{@const x = (index + 0.5) * style.streamWidth}
			{@const yStart = headerHeight}
			{@const yEnd = headerHeight + style.stepHeight * flowDiagram.steps.length}
			<image
				href={streamLine.iconPath}
				x={x - 0.5 * style.streamHeaderIconSize}
				y="0"
				width={style.streamHeaderIconSize}
				height={style.streamHeaderIconSize}
			/>
			<text
				{x}
				y={style.streamHeaderIconSize + 0.5 * style.streamHeaderLineHeight}
				class="actor-name">{streamLine.name}</text
			>
			<line x1={x} y1={yStart} x2={x} y2={yEnd} class="lifeline" />
		{/each}
	{/if}

	{#each flowDiagram.steps as step, index (index)}
		{#if stepIndices === undefined || stepIndices.includes(index)}
			<g class={useFragment ? 'fragment' : null} data-fragment-index={index + fragmentOffset}>
				{#if 'from' in step}
					{@const y = computeY(index)}
					{@const startX = (step.from + 0.5) * style.streamWidth}
					{@const endX = (step.to + 0.5) * style.streamWidth}
					{@const middleX = 0.5 * (startX + endX)}
					{@const direction = step.to > step.from ? 'forward' : 'return'}
					<line
						x1={startX}
						y1={y}
						x2={endX}
						y2={y}
						class="arrow {direction}"
						marker-end={'url(#' + arrowId + ')'}
					/>
					<text x={middleX} y={y - 7} class="arrow-label {direction}">{step.label}</text>
					<circle cx={startX} cy={y} r="12" class="step-circle" />
					<text x={startX} {y} class="step-num">{index + 1}</text>
				{:else}
					{@const { startX, startY, width, height } = computeBoundingBox(index, step)}
					{@const midX = startX + width / 2}
					{@const midY = startY + height / 2}
					<rect x={startX} y={startY} {width} {height} rx="5" class="process-box" />
					<text x={midX} y={midY} class="process-label">{step.label}</text>
					<circle cx={startX} cy={startY} r="12" class="step-circle" />
					<text x={startX} y={startY} class="step-num">{index + 1}</text>
				{/if}
			</g>
		{/if}
	{/each}
</svg>

<style>
	.diagram {
		width: 100%;
		height: auto;
		max-height: 1080px;
		display: block;
		margin: 0 auto;

		.actor-name {
			font-size: 16px;
			font-weight: bold;
			text-anchor: middle;
			fill: var(--flow-actor-name, #1e3c52);
		}

		.lifeline {
			stroke: var(--flow-lifeline, #4a90d9);
			stroke-width: 1.5;
			stroke-dasharray: 5, 5;
			opacity: var(--flow-lifeline-opacity, 0.4);
		}

		.step-circle {
			fill: var(--flow-step-bg, #4a90d9);
		}

		.step-num {
			font-size: 14px;
			font-weight: bold;
			text-anchor: middle;
			dominant-baseline: central;
			fill: var(--flow-step-text, white);
		}

		.arrow {
			stroke-width: 2;

			&.forward {
				stroke: var(--flow-forward, #4a90d9);
			}

			&.return {
				stroke: var(--flow-return, #7ecfb3);
			}
		}

		.arrow-label {
			font-size: 14px;
			opacity: 0.9;
			text-anchor: middle;

			&.forward {
				fill: var(--flow-forward, #4a90d9);
			}

			&.return {
				fill: var(--flow-return, #7ecfb3);
			}
		}

		.process-box {
			fill: var(--flow-process-bg, #ddeeff);
			stroke: var(--flow-process-stroke, #4a90d9);
			stroke-width: 1.5;
			stroke-dasharray: 5, 3;
		}

		.process-label {
			font-size: 14px;
			text-anchor: middle;
			dominant-baseline: central;
			fill: var(--flow-process-text, #1e3c52);
		}
	}
</style>
