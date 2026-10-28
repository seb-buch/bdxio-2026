<script lang="ts">
	import { Code } from '@seb-buch/slyd';
	import type { Snippet } from 'svelte';
	import type { CodeLocation } from './code-slide';

	type Props = {
		children: Snippet;
		contentKey?: string;
		highlightedLines?: string;
		location?: CodeLocation;
		description?: string;
	};
	let {
		children,
		contentKey,
		highlightedLines = '',
		location = 'server',
		description = ''
	}: Props = $props();
	const tooltipId = $props.id();
	let preview = $state<{ text: string; top: number; above: boolean }>();

	function enhanceJsonCode(container: HTMLElement) {
		if (location !== 'dto') return;
		const controller = new AbortController();
		const { signal } = controller;

		function decorate() {
			for (const line of container.querySelectorAll<HTMLElement>('.slyd-code .line')) {
				for (const token of Array.from(line.children)) {
					const text = token.textContent ?? '';
					if (
						!token.previousElementSibling?.textContent?.includes(':') ||
						!text.startsWith('"') ||
						!text.endsWith('"')
					)
						continue;
					if (line.textContent?.trimStart().startsWith('"clientDataJSON":')) {
						line.dataset.clientDataJson = JSON.parse(text);
						line.classList.add('client-data-json');
						line.tabIndex = 0;
						line.setAttribute('aria-label', 'Afficher clientDataJSON décodé');
						line.setAttribute('aria-describedby', tooltipId);
					}
					if (text.length > 66 && !token.classList.contains('json-string')) {
						const value = document.createElement('span');
						value.className = 'json-string-value';
						value.textContent = text.slice(1, -1);
						token.classList.add('json-string');
						token.replaceChildren('"', value, '"');
					}
				}
			}
		}

		function clientDataLine(target: EventTarget | null) {
			return target instanceof Element
				? target.closest<HTMLElement>('[data-client-data-json]')
				: null;
		}

		function show(event: Event) {
			const line = clientDataLine(event.target);
			if (!line) return;
			try {
				const encoded = line.dataset.clientDataJson!.replace(/-/g, '+').replace(/_/g, '/');
				const binary = atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '='));
				const text = new TextDecoder('utf-8', { fatal: true }).decode(
					Uint8Array.from(binary, (character) => character.charCodeAt(0))
				);
				const bounds = container.getBoundingClientRect();
				const row = line.getBoundingClientRect();
				const scale = bounds.width / container.offsetWidth;
				const slideBottom = container.closest('.slyd-slide')!.getBoundingClientRect().bottom;
				const above = row.bottom + 300 * scale > Math.min(slideBottom, window.innerHeight);
				preview = {
					text: JSON.stringify(JSON.parse(text), null, 2),
					top: ((above ? row.top : row.bottom) - bounds.top) / scale + (above ? -12 : 12),
					above
				};
			} catch {
				preview = undefined;
			}
		}

		function hide() {
			preview = undefined;
		}

		function leave(event: PointerEvent | FocusEvent) {
			const line = clientDataLine(event.target);
			if (!line || (event.relatedTarget instanceof Node && line.contains(event.relatedTarget)))
				return;
			if (event.type === 'pointerout' && document.activeElement === line) return;
			hide();
		}

		const observer = new MutationObserver(decorate);
		observer.observe(container, { childList: true, subtree: true });
		decorate();
		container.addEventListener('pointerover', show, { signal });
		container.addEventListener('pointerout', leave, { signal });
		container.addEventListener('focusin', show, { signal });
		container.addEventListener('focusout', leave, { signal });
		container.addEventListener(
			'keydown',
			(event) => {
				if (event.key === 'Escape' && preview) {
					hide();
					event.stopPropagation();
				}
			},
			{ signal }
		);
		window.addEventListener('slyd:slidechange', hide, { signal });
		window.addEventListener('slyd:fragmentchange', hide, { signal });
		return () => {
			observer.disconnect();
			controller.abort();
		};
	}
</script>

<div class="code-container fragment">
	<div class="code-panel" {@attach enhanceJsonCode}>
		<p class="description">{description}</p>
		<p class="location">
			{location === 'server'
				? 'Serveur · TypeScript'
				: location === 'browser'
					? 'Navigateur · TypeScript'
					: 'Échange · JSON'}
		</p>
		{#key contentKey}
			<Code
				{highlightedLines}
				lang={location === 'dto' ? 'jsonc' : 'ts'}
				theme="github-light-high-contrast"
				showLineNumbers
			>
				{@render children()}
			</Code>
		{/key}
		{#if preview}
			<div
				id={tooltipId}
				class="client-data-popup"
				class:above={preview.above}
				style:top="{preview.top}px"
				role="tooltip"
			>
				<pre>{preview.text}</pre>
			</div>
		{/if}
	</div>
</div>

<style>
	.code-container {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px;
		background: #faf9f5c9;
		backdrop-filter: blur(5px);
		z-index: 1;
	}
	.code-panel {
		position: relative;
		max-width: 100%;
		padding: 24px 32px;
		border-radius: 12px;
		background: var(--slyd-slide-bg-color);
		box-shadow: 0 0 20px #182a4326;
	}
	.description {
		margin: 0;
		font-size: 32px;
		font-weight: 700;
	}
	.location {
		margin: 6px 0 16px;
		font-size: 24px;
		color: #617087;
	}
	.code-panel :global(.slyd-code) {
		max-width: 100%;
		max-height: 760px;
		font-size: 24px;
	}
	.code-panel :global(pre.shiki) {
		line-height: 1.15;
	}
	.code-panel :global(.json-string-value) {
		display: inline-block;
		max-width: 48ch;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: bottom;
	}
	.code-panel :global(.client-data-json) {
		cursor: help;
	}
	.code-panel :global(.client-data-json .json-string-value) {
		text-decoration: underline dotted;
		text-underline-offset: 4px;
	}
	.code-panel :global(.client-data-json:focus-visible) {
		outline: 2px solid #617087;
		outline-offset: 3px;
	}
	.client-data-popup {
		position: absolute;
		left: 32px;
		width: 850px;
		max-width: calc(100% - 64px);
		box-sizing: border-box;
		padding: 20px 24px;
		border: 1px solid #617087;
		border-radius: 8px;
		background: var(--slyd-slide-bg-color);
		color: var(--slyd-slide-color, #182a43);
		box-shadow: 0 8px 28px #182a4333;
		pointer-events: none;
		z-index: 2;
	}
	.client-data-popup.above {
		transform: translateY(-100%);
	}
	.client-data-popup pre {
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		font-size: 22px;
		line-height: 1.35;
	}
</style>
