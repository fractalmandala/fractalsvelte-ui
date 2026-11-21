<!-- @component A highlight that sweeps through text, for loading or "AI thinking" labels. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		duration?: number;
		spread?: string;
		children?: Snippet;
	}

	let {
		duration = 1.8,
		spread = '12%',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<span
	class={['ink', 'ink-shimmer', className]}
	{@attach vars({ 'shimmer-ms': duration, 'shimmer-spread': spread })}
	{...rest}
>
	{@render children?.()}
</span>
