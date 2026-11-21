<!-- @component A reading-progress bar or ring, bound to the page or to an element as it passes through the viewport. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { scrollProgress } from '../../../motion/index.js';
	import type {  Tone, Placement  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		form?: 'bar' | 'ring';
		position?: Placement;
		target?: 'page' | 'element';
		tone?: Tone;
		children?: Snippet;
	}

	let {
		form = 'bar',
		position = 'top',
		target = 'page',
		tone = 'info',
		class: className,
		children,
		...rest
	}: Props = $props();

	const meter = $derived(scrollProgress({ target }));
	const bar = $derived(form === 'bar');
</script>

<div
	class={['relative', className]}
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
