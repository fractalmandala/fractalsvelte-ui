<!-- @component Inline code text. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Surface, Border, Size, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		surface?: Surface;
		border?: Border;
		/** Text step from the control size scale */
		size?: Size;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		surface = 'state-hover',
		border = 'border-none',
		size = 'h-sm',
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<code class="font-mono px-xs mincurved hgrow {surface} {border} {size} {textsize} {className}" {...restProps}>
	{@render children?.()}
</code>
