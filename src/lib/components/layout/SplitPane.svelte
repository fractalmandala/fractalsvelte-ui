<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: 'horizontal' | 'vertical';
		split?: number; // percentage 10-90
		minSize?: number; // percentage
		class?: string;
		paneA?: Snippet;
		paneB?: Snippet;
	}

	let {
		orientation = 'horizontal',
		split = $bindable(50),
		minSize = 15,
		class: className = '',
		paneA,
		paneB,
		...restProps
	}: Props = $props();

	let isDragging = $state(false);
	let containerEl: HTMLDivElement | undefined = $state();

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || !containerEl) return;
		const rect = containerEl.getBoundingClientRect();

		if (orientation === 'horizontal') {
			const pos = ((e.clientX - rect.left) / rect.width) * 100;
			split = Math.min(100 - minSize, Math.max(minSize, pos));
		} else {
			const pos = ((e.clientY - rect.top) / rect.height) * 100;
			split = Math.min(100 - minSize, Math.max(minSize, pos));
		}
	}

	function handlePointerUp() {
		isDragging = false;
	}
</script>

<div
	bind:this={containerEl}
	class="f-split-pane {className}"
	data-orientation={orientation}
	data-dragging={isDragging ? 'true' : undefined}
	{...restProps}
>
	<div
		class="f-pane f-pane-a"
		style={orientation === 'horizontal' ? `width: ${split}%;` : `height: ${split}%;`}
	>
		{#if paneA}
			{@render paneA()}
		{/if}
	</div>

	<div
		class="f-split-divider"
		role="separator"
		aria-orientation={orientation}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
	>
		<div class="f-split-handle"></div>
	</div>

	<div
		class="f-pane f-pane-b"
		style={orientation === 'horizontal' ? `width: ${100 - split}%;` : `height: ${100 - split}%;`}
	>
		{#if paneB}
			{@render paneB()}
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-split-pane {
			display: flex;
			width: 100%;
			height: 100%;
			min-height: 200px;
			box-sizing: border-box;
			overflow: hidden;
			user-select: none;
		}

		.f-split-pane[data-orientation='vertical'] {
			flex-direction: column;
		}

		.f-pane {
			overflow: auto;
			box-sizing: border-box;
		}

		.f-split-divider {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--f-border);
			transition: background var(--f-duration-fast) var(--f-ease);
			flex-shrink: 0;
		}

		.f-split-pane[data-orientation='horizontal'] .f-split-divider {
			width: 6px;
			cursor: col-resize;
		}

		.f-split-pane[data-orientation='vertical'] .f-split-divider {
			height: 6px;
			cursor: row-resize;
		}

		.f-split-divider:hover,
		.f-split-pane[data-dragging='true'] .f-split-divider {
			background: var(--f-primary);
		}

		.f-split-handle {
			width: 2px;
			height: 16px;
			background: var(--f-border-strong);
			border-radius: 1px;
		}

		.f-split-pane[data-orientation='vertical'] .f-split-handle {
			width: 16px;
			height: 2px;
		}
	}
</style>
