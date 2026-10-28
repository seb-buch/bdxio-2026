<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import type { SlideChangeDetail } from '@seb-buch/slyd';
	import type { State } from '#lib/demo/logic/common.js';
	import { clearFeedback } from '#lib/demo/logic/feedback.js';
	import DemoApplicationHeader from './DemoApplicationHeader.svelte';
	import '#lib/themes/demo-app.css';

	let { children, state }: { children: Snippet; state: State } = $props();
	let application: HTMLElement;

	onMount(() => {
		const slide = application.closest('.slyd-slide');
		const presentation = slide?.closest('.slyd');
		if (!slide || !presentation) return;
		const ownIndex = Array.from(presentation.querySelectorAll('.slyd-slide')).indexOf(slide);
		return on(window, 'slyd:slidechange', (event: CustomEvent<SlideChangeDetail>) => {
			if (event.target === presentation && event.detail.slideIndex === ownIndex)
				clearFeedback(state);
		});
	});
</script>

<section bind:this={application} class="demo-app" aria-label="Application BDX I/O 2026 démo">
	<DemoApplicationHeader />
	<div class="demo-app-content">
		{#if state.kind !== 'unavailable' && state.message}
			<p class="demo-form-message" role={state.messageKind === 'success' ? 'status' : 'alert'}>
				{state.message}
			</p>
		{/if}
		{@render children()}
	</div>
</section>
