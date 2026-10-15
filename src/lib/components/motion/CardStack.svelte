<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface CardStackItemData {
		id: string;
		title?: string;
		description?: string;
		badge?: string;
		[key: string]: any;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: CardStackItemData[];
		activeIndex?: number;
		offset?: number;
		scaleFactor?: number;
		class?: string;
		cardSnippet?: Snippet<[{ item: CardStackItemData; index: number; isTop: boolean }]>;
		onswipe?: (item: CardStackItemData, direction: 'left' | 'right') => void;
	}

	let {
		items = [],
		activeIndex = $bindable(0),
		offset = 12,
		scaleFactor = 0.05,
		class: className = '',
		cardSnippet,
		onswipe,
		...restProps
	}: Props = $props();

	let dragX = $state(0);
	let isDragging = $state(false);
	let startPointerX = 0;

	const topItem = $derived(items[activeIndex % (items.length || 1)]);

	function handlePointerDown(e: PointerEvent) {
		if (items.length <= 1) return;
		isDragging = true;
		startPointerX = e.clientX - dragX;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		dragX = e.clientX - startPointerX;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {}

		const threshold = 80;
		if (dragX > threshold) {
			// Swipe right
			const current = topItem;
			dragX = 0;
			activeIndex = (activeIndex + 1) % items.length;
			onswipe?.(current, 'right');
		} else if (dragX < -threshold) {
			// Swipe left
			const current = topItem;
			dragX = 0;
			activeIndex = (activeIndex + 1) % items.length;
			onswipe?.(current, 'left');
		} else {
			dragX = 0;
		}
	}

	export function next() {
		if (items.length > 0) {
			activeIndex = (activeIndex + 1) % items.length;
		}
	}

	export function prev() {
		if (items.length > 0) {
			activeIndex = (activeIndex - 1 + items.length) % items.length;
		}
	}
</script>

<div
	class="f-card-stack-container {className}"
	{...restProps}
>
	<div
		class="f-card-stack-stage"
		role="region"
		aria-label="Stacked cards"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
	>
		{#each items as item, idx (item.id)}
			{@const diff = (idx - activeIndex + items.length) % items.length}
			{@const isTop = diff === 0}
			{@const isVisible = diff < 4}
			{#if isVisible}
				{@const translateY = diff * offset}
				{@const scale = 1 - diff * scaleFactor}
				{@const zIndex = items.length - diff}
				{@const currentDragX = isTop ? dragX : 0}
				{@const rotate = isTop ? dragX * 0.08 : 0}

				<div
					class="f-card-stack-item"
					class:top={isTop}
					class:dragging={isTop && isDragging}
					style="
						transform: translate3d({currentDragX}px, {translateY}px, 0) scale({scale}) rotate({rotate}deg);
						z-index: {zIndex};
						opacity: {1 - diff * 0.18};
					"
				>
					{#if cardSnippet}
						{@render cardSnippet({ item, index: idx, isTop })}
					{:else}
						<div class="f-card-stack-default">
							{#if item.badge}
								<span class="f-card-badge">{item.badge}</span>
							{/if}
							<h4 class="f-card-title">{item.title ?? `Card ${idx + 1}`}</h4>
							{#if item.description}
								<p class="f-card-desc">{item.description}</p>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>

	{#if items.length > 1}
		<div class="f-card-stack-controls">
			<button
				type="button"
				class="f-card-ctrl-btn"
				aria-label="Previous card"
				onclick={prev}
			>
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="15 18 9 12 15 6" />
				</svg>
			</button>

			<div class="f-card-stack-dots">
				{#each items as _, i (i)}
					<span
						class="f-card-dot"
						class:active={i === activeIndex % items.length}
					></span>
				{/each}
			</div>

			<button
				type="button"
				class="f-card-ctrl-btn"
				aria-label="Next card"
				onclick={next}
			>
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-card-stack-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1.5rem;
			box-sizing: border-box;
			user-select: none;
		}

		.f-card-stack-stage {
			position: relative;
			width: 320px;
			height: 200px;
			touch-action: none;
			cursor: grab;
		}

		.f-card-stack-stage:active {
			cursor: grabbing;
		}

		.f-card-stack-item {
			position: absolute;
			inset: 0;
			border-radius: var(--f-radius-xl);
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-lg);
			transform-origin: center bottom;
			box-sizing: border-box;
			transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1),
				opacity 0.35s ease;
		}

		.f-card-stack-item.dragging {
			transition: none;
		}

		.f-card-stack-default {
			padding: 1.5rem;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.f-card-badge {
			align-self: flex-start;
			font-size: var(--f-text-xs);
			font-weight: 600;
			padding: 2px 8px;
			border-radius: 9999px;
			background: var(--f-primary-muted, rgba(99, 102, 241, 0.15));
			color: var(--f-primary);
		}

		.f-card-title {
			margin: 0.5rem 0 0.25rem 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
		}

		.f-card-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.5;
		}

		.f-card-stack-controls {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		.f-card-ctrl-btn {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			color: var(--f-text);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-card-ctrl-btn:hover {
			background: var(--f-hover);
		}

		.f-card-stack-dots {
			display: flex;
			gap: 6px;
		}

		.f-card-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--f-border);
			transition: background var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-card-dot.active {
			background: var(--f-primary);
			transform: scale(1.3);
		}
	}
</style>
