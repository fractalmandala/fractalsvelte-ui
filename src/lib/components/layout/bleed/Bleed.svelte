<!-- @component Breaks out of parent padding along horizontal, vertical, or full-viewport axes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Gap } from '../../../internal/tokens.js';
import { gapValue } from '../../../internal/helpers.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Negative inline margin on the gap ladder. */
		inline?: Gap;
		/** Negative block margin on the gap ladder. */
		block?: Gap;
		/** Expand across the full viewport width regardless of container width. */
		full?: boolean;
		/** Content breaking past container bounds. */
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
		'bleed-x': inline ? gapValue(inline) : undefined,
		'bleed-y': block ? gapValue(block) : undefined
	})}
	{...rest}
>
	{@render children?.()}
</div>
