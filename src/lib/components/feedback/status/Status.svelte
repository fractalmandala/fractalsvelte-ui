<!-- @component A status dot with a label, for things like "Operational" or "Degraded". -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type Gap, type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		tone?: Tone;
		pulse?: boolean;
		size?: Size;
		gap?: Gap;
		children?: Snippet;
	}

	let {
		tone = 'success',
		pulse = false,
		size = 'h-lg',
		gap = 'gap-sm',
		children,
		class: className,
		...rest
	}: Props = $props();
</script>

<span class={['row ycenter', gap, size, className]} {...rest}>
	<span class={['relative inline-flex shrink-0', `text-${`tone`}`]}>
		{#if pulse}
			<span class="dot absolute cover anim-ping" aria-hidden="true"></span>
		{/if}
		<span class="dot" aria-hidden="true"></span>
	</span>
	{#if children}
		<span class="lh14">{@render children()}</span>
	{/if}
</span>
