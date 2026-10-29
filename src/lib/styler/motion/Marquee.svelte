<!-- @component Content that scrolls continuously in a loop. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Pixels per second */
		speed?: number;
		pauseOnHover?: boolean;
		reverse?: boolean;
		gap?: Space;
		class?: string;
		children?: Snippet;
	}

	let {
		speed = 40,
		pauseOnHover = true,
		reverse = false,
		gap = 'xl',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let railEl = $state<HTMLDivElement | null>(null);
	let firstEl = $state<HTMLDivElement | null>(null);
	let paused = $state(false);

	// The rail is a .scroll-x strip and the motion is its scroll position: each
	// frame advances scrollLeft and wraps after one copy of the content, which
	// is a scroll offset, not a style. Reduced-motion users get a static rail.
	$effect(() => {
		if (!railEl || !firstEl) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const rail = railEl;
		const first = firstEl;
		let last = performance.now();
		let pos = reverse ? first.offsetWidth : 0;
		let raf = requestAnimationFrame(function step(now) {
			const span = first.offsetWidth + (first.nextElementSibling ? (first.nextElementSibling as HTMLElement).offsetLeft - first.offsetLeft - first.offsetWidth : 0);
			if (!paused && span > 0) {
				pos += ((reverse ? -1 : 1) * speed * (now - last)) / 1000;
				if (pos >= span) pos -= span;
				if (pos < 0) pos += span;
				rail.scrollLeft = pos;
			}
			last = now;
			raf = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(raf);
	});
</script>

<div
	bind:this={railEl}
	class="row scroll-x gap-{gap} {className}"
	role="marquee"
	onpointerenter={() => pauseOnHover && (paused = true)}
	onpointerleave={() => (paused = false)}
	{...restProps}
>
	<div bind:this={firstEl} class="row ycenter shrink-0 gap-{gap}">{@render children?.()}</div>
	<div class="row ycenter shrink-0 gap-{gap}" aria-hidden="true">{@render children?.()}</div>
	<div class="row ycenter shrink-0 gap-{gap}" aria-hidden="true">{@render children?.()}</div>
</div>
