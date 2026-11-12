<!-- @component A reading-progress bar or ring, bound to the page or to an element as it passes through the viewport. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { scrollProgress } from '../../../motion/index.js';
	import type { Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** A bar along the edge of the viewport, or a ring that fills with the same progress. */
		variant?: 'bar' | 'ring';
		/** Where a `bar` sits — the top or the bottom of the viewport. Ignored by the ring. */
		position?: 'top' | 'bottom';
		/** `page` tracks the document scroll; `element` tracks this component's passage through the viewport. */
		target?: 'page' | 'element';
		/** The colour of the fill or ring. */
		tone?: Tone;
		/** Content whose passage is tracked when `target` is `element`. */
		children?: Snippet;
	}

	let {
		variant = 'bar',
		position = 'top',
		target = 'page',
		tone = 'info',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const meter = $derived(scrollProgress({ target }));
	const bar = $derived(variant === 'bar');
</script>

<div
	class={['relative', klass]}
	{@attach target === 'element' ? meter : undefined}
	{...rest}
>
	{#if bar}
		<div
			class={['track hairline wfull', position === 'top' ? 'edge-top' : 'edge-bottom', `tone-${tone}`]}
			role="progressbar"
			aria-label="Reading progress"
			{@attach target === 'page' ? meter : undefined}
		>
			<div class="fill scaled"></div>
		</div>
	{:else}
		<div
			class={['ring', `tone-${tone}`]}
			role="progressbar"
			aria-label="Reading progress"
			{@attach target === 'page' ? meter : undefined}
		></div>
	{/if}
	{@render children?.()}
</div>
