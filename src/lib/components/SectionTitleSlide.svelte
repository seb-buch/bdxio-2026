<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	type Props = {
		title: string;
		children?: Snippet;
	};

	const { title, children }: Props = $props();
</script>

<Slide>
	<div class="section-title">
		<h2>{title}</h2>
	</div>
	<SpeakerNotes>
		{@render children?.()}
		<p>
			Fond : illustration BDX I/O 2026, texte central retiré avec Imagegen.
			https://bdxio.fr/_ipx/_/images/illustrations/back-to-school-2026.png
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.section-title {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		background: #f1f5f8bb;
		backdrop-filter: blur(10px);
		border-radius: 10px;
		padding: 20px;
		box-sizing: border-box;
	}
</style>
