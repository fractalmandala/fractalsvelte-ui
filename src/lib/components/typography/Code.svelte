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
		surface = 'bg-sunken',
		border = 'border-none',
		size = 'h-sm',
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<code class="mono px-xs radius-xs size {surface} {border} {size} {textsize} {className}" style:height="auto" {...restProps}>
	{@render children?.()}
</code>
