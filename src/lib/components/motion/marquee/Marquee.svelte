<!-- @component An infinite scrolling strip of content, with edge fades, pause on hover, and a static fallback under reduced motion. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { reducedMotion, vars } from '../../../motion/index.js';

	/** A step on the space ladder. */
	type Gap = 'xs' | 'sm' | 'md' | 'bs' | 'lg' | 'xl' | '2xl' | '3xl';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Which way the content travels. `up` and `down` need a container with a height. */
		direction?: 'left' | 'right' | 'up' | 'down';
		/** Travel speed in pixels per second. The loop length is measured, so a long strip and a short one move at the same pace. */
		speed?: number;
		/** The space between items, and between one copy of the content and the next — a step on the space ladder. */
		gap?: Gap;
		/** Pauses the strip while the pointer is over it or keyboard focus is inside it. */
		pauseOnHover?: boolean;
		/** Fades the two edges the content enters and leaves through. */
		fade?: boolean;
		/** How many copies of the content the track holds (at least 2). Raise it when the content is much shorter than the strip. */
		repeat?: number;
		/** The items. Rendered once for assistive technology; the copies are hidden from it and inert. */
		children?: Snippet;
	}

	let {
		direction = 'left',
		speed = 48,
		gap = 'lg',
		pauseOnHover = true,
		fade = false,
		repeat = 2,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const vertical = $derived(direction === 'up' || direction === 'down');
	const still = $derived(reducedMotion.current);
	const copies = $derived(still ? [0] : Array.from({ length: Math.max(2, Math.round(repeat)) }, (_, i) => i));

	/** One loop's travel: a copy's length plus one gap, in px. */
	let distance = $state(0);

	const measure: Attachment<HTMLElement> = (group) => {
		const axisY = vertical;
		const root = group.parentElement;
		if (!root || typeof ResizeObserver === 'undefined') return;
		const read = () => {
			const style = getComputedStyle(root);
			const space = Number.parseFloat(axisY ? style.rowGap : style.columnGap) || 0;
			distance = (axisY ? group.offsetHeight : group.offsetWidth) + space;
		};
		const ro = new ResizeObserver(read);
		ro.observe(group);
		ro.observe(root);
		return () => ro.disconnect();
	};

	const duration = $derived(distance > 0 && speed > 0 ? distance / speed : null);
</script>

<div
	class={[
		'marquee',
		vertical && 'vertical',
		(direction === 'right' || direction === 'down') && 'reverse',
		pauseOnHover && 'pausable',
		fade && !still && 'fade',
		still && 'still',
		klass
	]}
	{@attach vars({ gap: `var(--space-${gap})`, duration })}
	{...rest}
>
	{#each copies as copy (copy)}
		{#if copy === 0}
			<div class="marquee-group" {@attach measure}>
				{@render children?.()}
			</div>
		{:else}
			<div class="marquee-group" aria-hidden="true" inert>
				{@render children?.()}
			</div>
		{/if}
	{/each}
</div>
