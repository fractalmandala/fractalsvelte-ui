<!-- @component An infinite scrolling strip of content, with edge fades, pause on hover, and a static fallback under reduced motion. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  Attachment  } from 'svelte/attachments';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { reducedMotion, vars } from '../../../motion/index.js';
	import { type Gap } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: 'left' | 'right' | 'up' | 'down';
		speed?: number;
		gap?: Gap;
		pauseOnHover?: boolean;
		fade?: boolean;
		repeat?: number;
		children?: Snippet;
	}

	let {
		direction = 'left',
		speed = 48,
		gap = 'gap-lg',
		pauseOnHover = true,
		fade = false,
		repeat = 2,
		class: className,
		children,
		...rest
	}: Props = $props();

	const vertical = $derived(direction === 'up' || direction === 'down');
	const reverse = $derived(direction === 'right' || direction === 'down');
	const still = $derived(reducedMotion.current);
	const copies = $derived(still ? [0] : Array.from({ length: Math.max(2, Math.round(repeat)) }, (_, i) => i));

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
		reverse && 'reverse',
		pauseOnHover && 'pausable',
		fade && !still && 'fade',
		still && 'still',
		className
	]}
	{@attach vars({ duration })}
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
