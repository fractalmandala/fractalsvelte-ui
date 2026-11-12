<!-- @component A highlight that sweeps through text, for loading or "AI thinking" labels. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Seconds for one sweep of the highlight. */
		duration?: number;
		/** Width of the highlight, as a CSS length along the gradient. */
		spread?: string;
		/** The label the highlight sweeps through. */
		children?: Snippet;
	}

	let {
		duration = 1.8,
		spread = '12%',
		class: klass,
		children,
		...rest
	}: Props = $props();
</script>

<span
	class={['ink', 'ink-shimmer', klass]}
	{@attach vars({ 'shimmer-ms': duration, 'shimmer-spread': spread })}
	{...rest}
>
	{@render children?.()}
</span>
