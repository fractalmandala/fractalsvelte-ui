<!-- @component A scroll-snap carousel with autoplay, drag, and a spring-loaded indicator. -->

<script lang="ts">
	import { untrack } from 'svelte';
	import type {  ComponentProps, Snippet  } from 'svelte';
	import { type Gap, type Pad, type Shape, type TextColor } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronLeft, luChevronRight } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { reducedMotion, vars } from '../../../motion/index.js';
	import { setCarousel, type SlideMeta } from './carousel.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		index?: number;
		onIndexChange?: (index: number) => void;
		loop?: boolean;
		autoplay?: boolean | number;
		perView?: number;
		gap?: Gap;
		shape?: Shape;
		textColor?: TextColor;
		navButtonProps?: ComponentProps<typeof Button>;
		label?: string;
		children?: Snippet;
	}

	let {
		index = $bindable(0),
		onIndexChange,
		loop = false,
		autoplay = false,
		perView = 1,
		gap = 'gap-md',
		shape = 'modern',
		textColor = 'text-muted',
		navButtonProps,
		label = 'Carousel',
		class: className,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let slides = $state<SlideMeta[]>([]);
	let reel = $state<HTMLElement | null>(null);
	let dots = $state<HTMLElement | null>(null);
	let dotEls: HTMLElement[] = [];
	let dragging = $state(false);
	let hovered = $state(false);
	let focused = $state(false);
	let ix = $state(0);
	let iy = $state(0);
	let iw = $state(0);
	let ih = $state(0);

	const total = $derived(slides.length);
	const safeIndex = $derived(total === 0 ? 0 : Math.min(Math.max(0, index), total - 1));
	const currentLabel = $derived(slides[safeIndex]?.label ?? `Slide ${safeIndex + 1}`);
	const canPrev = $derived(loop || safeIndex > 0);
	const canNext = $derived(loop || safeIndex < total - 1);
	const paused = $derived(hovered || focused || reducedMotion.current || !autoplay);
	const interval = $derived(typeof autoplay === 'number' ? autoplay : 5000);

	// A slide registers from an attachment, which would otherwise subscribe to the very
	// list it is adding to: read → write → re-run, forever.
	function register(meta: SlideMeta) {
		untrack(() => {
			slides = [...slides, meta];
		});
		return () => {
			untrack(() => {
				slides = slides.filter((item) => item.node !== meta.node);
			});
		};
	}

	function position(node: HTMLElement | null): number {
		if (!node) return -1;
		return slides.findIndex((item) => item.node === node);
	}

	setCarousel({
		uid,
		register,
		index: () => safeIndex,
		total: () => total,
		position
	});

	function step(): number {
		if (!reel || total === 0) return 0;
		const slide = slides[0]?.node;
		if (!slide) return reel.clientWidth;
		const style = getComputedStyle(reel);
		const gapPx = Number.parseFloat(style.columnGap || style.gap || '0') || 0;
		return slide.getBoundingClientRect().width + gapPx;
	}

	function setIndex(next: number, scroll = true) {
		if (total === 0) return;
		let target = next;
		if (loop) target = ((next % total) + total) % total;
		else target = Math.min(Math.max(0, next), total - 1);
		index = target;
		onIndexChange?.(target);
		if (scroll && reel) {
			reel.scrollTo({
				left: target * step(),
				behavior: reducedMotion.current ? 'auto' : 'smooth'
			});
		}
	}

	function go(delta: number) {
		setIndex(safeIndex + delta);
	}

	function measureIndicator() {
		const root = dots;
		const el = dotEls[safeIndex];
		if (!root || !el) return;
		const a = root.getBoundingClientRect();
		const b = el.getBoundingClientRect();
		ix = b.left - a.left;
		iy = b.top - a.top;
		iw = b.width;
		ih = b.height;
	}

	$effect(() => {
		void safeIndex;
		void total;
		queueMicrotask(measureIndicator);
	});

	$effect(() => {
		if (paused) return;
		const id = setInterval(() => go(1), interval);
		return () => clearInterval(id);
	});

	function onScroll() {
		if (dragging || !reel) return;
		const width = step();
		if (width <= 0) return;
		const next = Math.round(reel.scrollLeft / width);
		if (next !== index && next >= 0 && next < total) {
			index = next;
			onIndexChange?.(next);
		}
	}

	function onPointerDown(event: PointerEvent) {
		if (!reel || event.button !== 0) return;
		const startX = event.clientX;
		const startScroll = reel.scrollLeft;
		let moved = false;
		let lastX = startX;
		let lastT = event.timeStamp;
		let velocity = 0;
		const track = reel;

		const onMove = (e: PointerEvent) => {
			const dx = e.clientX - startX;
			if (!moved && Math.abs(dx) < 6) return;
			moved = true;
			dragging = true;
			track.scrollLeft = startScroll - dx;
			const dt = e.timeStamp - lastT;
			if (dt > 0) velocity = (e.clientX - lastX) / dt;
			lastX = e.clientX;
			lastT = e.timeStamp;
		};

		const onUp = (e: PointerEvent) => {
			track.removeEventListener('pointermove', onMove);
			track.removeEventListener('pointerup', onUp);
			track.removeEventListener('pointercancel', onUp);
			if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
			if (!moved) {
				dragging = false;
				return;
			}
			const width = step();
			let target = width > 0 ? track.scrollLeft / width : safeIndex;
			if (!reducedMotion.current && Math.abs(velocity) > 0.2) {
				target -= velocity * 180;
			}
			dragging = false;
			setIndex(Math.round(target));
		};

		track.addEventListener('pointermove', onMove);
		track.addEventListener('pointerup', onUp);
		track.addEventListener('pointercancel', onUp);
		track.setPointerCapture(event.pointerId);
	}

	function onKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			go(-1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			go(1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			setIndex(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			setIndex(total - 1);
		}
	}

	function reelAttach(node: HTMLElement) {
		reel = node;
		return () => {
			if (reel === node) reel = null;
		};
	}

	function dotsAttach(node: HTMLElement) {
		dots = node;
		queueMicrotask(measureIndicator);
		return () => {
			if (dots === node) dots = null;
		};
	}
</script>

<div
	class={['box', gap, className]}
	role="region"
	aria-roledescription="carousel"
	aria-label={label}
	onkeydown={onKeydown}
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={(event) => {
		if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) focused = false;
	}}
	{...rest}
>
	<div class="row ycenter gap-sm">
		<Button
			variant="ghost"
			size="h-sm"
			icon={luChevronLeft}
			disabled={!canPrev}
			aria-label="Previous slide"
			onclick={() => go(-1)}
			{...navButtonProps}
			class="btn-icon {navButtonProps?.class ?? ''}"
		/>
		<div
			class={['slides reel carousel-track grow', 'is-draggable', dragging && 'is-dragging']}
			role="group"
			aria-label="Slides"
			{@attach vars({ 'per-view': perView })}
			{@attach reelAttach}
			onscroll={onScroll}
			onpointerdown={onPointerDown}
		>
			{@render children?.()}
		</div>
		<Button
			variant="ghost"
			size="h-sm"
			icon={luChevronRight}
			disabled={!canNext}
			aria-label="Next slide"
			onclick={() => go(1)}
			{...navButtonProps}
			class="btn-icon {navButtonProps?.class ?? ''}"
		/>
	</div>
	<div class="row ycenter xcenter gap-sm relative" {@attach dotsAttach}>
		<div class={['indicator spring spring-snappy state-selected', shape]} {@attach vars({ ix, iy, iw, ih })}></div>
		{#each slides as slide, i (slide.node)}
			<button
				type="button"
				class={['bare focus-ring', 'pad-sm']}
				aria-label={slide.label ?? `Go to slide ${i + 1}`}
				aria-current={i === safeIndex ? 'true' : undefined}
				onclick={() => setIndex(i)}
				{@attach (el) => { dotEls[i] = el; queueMicrotask(measureIndicator); return () => { if (dotEls[i] === el) delete dotEls[i]; }; }}
			>
				<span class={['dot', i === safeIndex ? '' : textColor]}></span>
			</button>
		{/each}
	</div>
	<div class="sr-only" aria-live="polite" aria-atomic="true">
		{currentLabel}, slide {safeIndex + 1} of {total || 1}
	</div>
</div>
