<!-- @component Responsive draggable and swipeable carousel slider with slide snippet, next/prev arrow buttons, and indicator dots. -->

<script lang="ts" generics="T">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import IconButton from '../actions/IconButton.svelte';
	import { klChevronLeft, klChevronRight } from '$lib/icons/keylinestroke.js';
	import type { Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** One entry per slide, passed to the `slide` snippet. */
		items?: T[];
		slide?: Snippet<[T, number]>;
		/** Accessible name for the carousel region. */
		label?: string;
		index?: number;
		/** How many slides are visible at once. */
		perView?: number;
		/** Space between slides, as a CSS length such as `1rem`. */
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

<section class="relative box gap-sm wfull {shape} {shadow} {textsize} {className}" aria-label={label} onkeydown={onKeyDown} {...restProps}>
	<!-- .reel is the scroll-snapping row; .carousel-track adds drag-to-scroll on top of it. -->
	<div
		bind:this={track}
		class="reel carousel-track {isDragging ? 'is-dragging' : ''} {draggable ? 'is-draggable' : ''}"
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
			<div class="min0" style:flex="0 0 calc((100% - ({gap} * {perView - 1})) / {perView})">
				{#if slide}
					{@render slide(item, i)}
				{:else}
					<div class="pad-md state-hover modern ta-c">Slide {i + 1}</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="row ycenter xbetween pt-xs">
		<div class="row ycenter gap-xs">
			{#each { length: maxIndex + 1 }, i (i)}
				<button
					type="button"
					class="btn-icon h-xs round {index === i ? 'themed' : 'secondary'}"
					aria-label="Go to slide {i + 1}"
					aria-current={index === i ? 'true' : undefined}
					onclick={() => goTo(i)}
				></button>
			{/each}
		</div>
		<div class="row ycenter gap-xs">
			<IconButton variant="outline" size="h-bs" label="Previous slide" disabled={index <= 0} onclick={() => goTo(index - 1)}>
				<Icon icon={klChevronLeft} />
			</IconButton>
			<IconButton variant="outline" size="h-bs" label="Next slide" disabled={index >= maxIndex} onclick={() => goTo(index + 1)}>
				<Icon icon={klChevronRight} />
			</IconButton>
		</div>
	</div>
</section>

