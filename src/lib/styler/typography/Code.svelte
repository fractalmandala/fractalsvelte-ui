<!-- @component Inline code text. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Surface, Border, Size } from '../types';

	interface Props extends HTMLAttributes<HTMLElement> {
		surface?: Surface;
		border?: Border;
		/** Text step from the control size scale */
		size?: Size;
		class?: string;
		children?: Snippet;
	}

	let {
		surface = 'bg-sunken',
		border = 'border-none',
		size = 'h-sm',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<code class="mono px-xs radius-xs el-size {surface} {border} {size} {className}" style:height="auto" {...restProps}>
	{@render children?.()}
</code>
