<!-- @component A status dot with a label, for things like "Operational" or "Degraded". -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { textClass, toneText, type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The meaning of the status. */
		tone?: Tone;
		/** Draws a pinging halo around the dot, for a live or degraded state. */
		pulse?: boolean;
		/** The size of the dot and the label. */
		size?: Size;
		/** The label, such as "Operational". */
		children?: Snippet;
	}

	let {
		tone = 'success',
		pulse = false,
		size = 'md',
		children,
		class: klass,
		...rest
	}: Props = $props();
</script>

<span class={['row ycenter gap-sm', textClass[size], klass]} {...rest}>
	<span class={['relative inline-flex shrink-0', toneText[tone]]}>
		{#if pulse}
			<span class="dot absolute cover anim-ping" aria-hidden="true"></span>
		{/if}
		<span class="dot" aria-hidden="true"></span>
	</span>
	{#if children}
		<span class="lh14">{@render children()}</span>
	{/if}
</span>
