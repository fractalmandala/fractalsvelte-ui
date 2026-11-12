<!-- @component A bar that sticks to the top or bottom of its scroll container and gains glass and elevation only while stuck. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { scrollParent } from './sticky-bar.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Which edge of the scroll container the bar sticks to. */
		position?: 'top' | 'bottom';
		/** How far the stuck bar sits from that edge, as a CSS length. */
		offset?: string;
		/** The bar's content — a toolbar, a title, or a save row. */
		children?: Snippet;
	}

	let {
		position = 'top',
		offset = '0px',
		class: klass,
		children,
		...rest
	}: Props = $props();

	let stuck = $state(false);

	function observe(node: HTMLElement) {
		const root = scrollParent(node);
		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry) stuck = !entry.isIntersecting;
			},
			{ root, threshold: 0 }
		);
		io.observe(node);
		return () => io.disconnect();
	}
</script>

{#if position === 'top'}
	<div class="sentinel start" {@attach observe}></div>
{/if}

<div
	class={[
		'sticky z-sticky spring pop open',
		position === 'top' ? 'pin-top enter-up' : 'pin-bottom enter-down',
		stuck && 'glass rim shad-sm',
		klass
	]}
	data-stuck={stuck || undefined}
	{@attach vars({ offset })}
	{...rest}
>
	{@render children?.()}
</div>

{#if position === 'bottom'}
	<div class="sentinel end" {@attach observe}></div>
{/if}
