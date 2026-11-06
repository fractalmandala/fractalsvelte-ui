<!-- @component Responsive draggable and swipeable carousel slider with slide snippet, next/prev arrow buttons, and indicator dots. -->

<script lang="ts" generics="T">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronLeft, luChevronRight } from '@fractaldesign/icons/lucide';
	import type { Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: T[];
		slide?: Snippet<[T, number]>;
		label?: string;
		index?: number;
		perView?: number;
		gap?: string;
		draggable?: boolean;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
	}

	let {
		items = [],
		slide,
		label = 'Carousel',
		index = $bindable(0),
		perView = 1,
		gap = '1rem',
		draggable = true,
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		class: className = '',
		...restProps
	}: Props = $props();

	let track: HTMLElement | undefined = $state();
	let isDragging = $state(false);
	let startX = 0;
	let scrollStart = 0;
	let draggedDistance = 0;

	const maxIndex = $derived(Math.max(0, (items?.length ?? 0) - perView));

	function goTo(i: number) {
		index = Math.max(0, Math.min(i, maxIndex));
		if (!track) return;
		const el = track.children[index] as HTMLElement | undefined;
		if (el) {
			track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: 'smooth' });
		}
	}

	function onScroll() {
		if (isDragging || !track || !track.children.length) return;
		const itemWidth = (track.children[0] as HTMLElement).offsetWidth || 1;
		const gapWidth = parseFloat(getComputedStyle(track).columnGap || '0');
		index = Math.round(track.scrollLeft / (itemWidth + gapWidth));
	}

	function onPointerDown(e: PointerEvent) {
		if (!draggable || e.button !== 0 || !track) return;
		isDragging = true;
		startX = e.clientX;
		scrollStart = track.scrollLeft;
		draggedDistance = 0;
		try {
			track.setPointerCapture(e.pointerId);
		} catch {}
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging || !track) return;
		const deltaX = e.clientX - startX;
		draggedDistance = Math.abs(deltaX);
		track.scrollLeft = scrollStart - deltaX;
	}

	function onPointerUp(e: PointerEvent) {
		if (!isDragging || !track) return;
		isDragging = false;
		try {
			track.releasePointerCapture(e.pointerId);
		} catch {}

		const deltaX = e.clientX - startX;
		const itemWidth = (track.children[0] as HTMLElement)?.offsetWidth || 1;
		const gapWidth = parseFloat(getComputedStyle(track).columnGap || '0');
		const stride = itemWidth + gapWidth;

		const threshold = Math.min(60, stride * 0.15);
		if (deltaX < -threshold) {
			goTo(index + 1);
		} else if (deltaX > threshold) {
			goTo(index - 1);
		} else {
			goTo(Math.round(track.scrollLeft / stride));
		}
	}

	function onClickCapture(e: MouseEvent) {
		if (draggedDistance > 6) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goTo(index - 1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			goTo(index + 1);
		}
	}
</script>

<section
	class="carousel-root box gap-sm {shape} {shadow} {textsize} {className}"
	aria-label={label}
	onkeydown={onKeyDown}
	{...restProps}
>
	<div
		bind:this={track}
		class="carousel-track {isDragging ? 'is-dragging' : ''} {draggable ? 'is-draggable' : ''}"
		style:column-gap={gap}
		onscroll={onScroll}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onclickcapture={onClickCapture}
		role="region"
		aria-label="{label} slides"
	>
		{#each items as item, i (i)}
			<div
				class="carousel-slide"
				style:flex="0 0 calc((100% - ({gap} * {perView - 1})) / {perView})"
			>
				{#if slide}
					{@render slide(item, i)}
				{:else}
					<div class="pad-md bg-sunken radius-md text-center">Slide {i + 1}</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="row ycenter xbetween pt-xs">
		<div class="row ycenter gap-xs">
			{#each { length: maxIndex + 1 }, i}
				<button
					type="button"
					class="dot-btn {index === i ? 'active' : ''}"
					aria-label="Go to slide {i + 1}"
					onclick={() => goTo(i)}
				></button>
			{/each}
		</div>

		<div class="row ycenter gap-xs">
			<button
				type="button"
				class="nav-btn"
				disabled={index <= 0}
				aria-label="Previous slide"
				onclick={() => goTo(index - 1)}
			>
				<Icon icon={luChevronLeft} />
			</button>
			<button
				type="button"
				class="nav-btn"
				disabled={index >= maxIndex}
				aria-label="Next slide"
				onclick={() => goTo(index + 1)}
			>
				<Icon icon={luChevronRight} />
			</button>
		</div>
	</div>
</section>

<style>
	.carousel-root {
		position: relative;
		width: 100%;
	}

	.carousel-track {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-y pinch-zoom;
		user-select: none;
		-webkit-user-select: none;
	}

	.carousel-track.is-draggable {
		cursor: grab;
	}

	.carousel-track.is-dragging {
		cursor: grabbing;
		scroll-snap-type: none;
		scroll-behavior: auto;
	}

	.carousel-track.is-dragging :global(*) {
		pointer-events: none;
		user-select: none;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	.carousel-slide {
		scroll-snap-align: start;
		min-width: 0;
	}

	.dot-btn {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
		background: var(--border-strong, #ccc);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background 150ms ease, width 150ms ease;
	}

	.dot-btn.active {
		width: 20px;
		background: var(--theme-color, #22c55e);
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm, 4px);
		border: 1px solid var(--border, #e5e7eb);
		background: var(--bg-surface, #fff);
		color: var(--text-primary, #111);
		cursor: pointer;
		padding: 0;
	}

	.nav-btn:hover:not(:disabled) {
		background: var(--bg-sunken, #f4f4f4);
	}

	.nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
</style>
