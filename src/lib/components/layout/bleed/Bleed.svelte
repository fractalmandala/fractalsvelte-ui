<!-- @component Breaks out of parent padding along horizontal, vertical, or full-viewport axes. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type Space } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		inline?: Space;
		block?: Space;
		full?: boolean;
		children?: Snippet;
	}

	let {
		inline,
		block,
		full = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const classes = $derived([
		full && 'bleed-full',
		!full && inline && 'bleed-inline',
		block && 'bleed-block',
		className
	]);
</script>

<div
	class={classes}
	{@attach vars({
		'bleed-x': inline ? `var(--space-${inline})` : undefined,
		'bleed-y': block ? `var(--space-${block})` : undefined
	})}
	{...rest}
>
	{@render children?.()}
</div>
