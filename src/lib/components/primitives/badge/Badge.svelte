<!-- @component A small status or count label on the shared variant and shape axes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import type { Shape, Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The visual style, from the shared variant axis. `soft` is the quiet default. */
		variant?: Variant;
		/** The label height. Text follows this unless `textSize` is set. */
		size?: 'sm' | 'md' | 'lg';
		/** The text scale, independent of the badge height. Follows `size` when omitted. */
		textSize?: 'sm' | 'md' | 'lg';
		/** The corner shape. Pills are the default. */
		shape?: Shape;
		/** Draws a small dot in the current ink before the label, for live or status state. */
		dot?: boolean;
		/** An icon drawn before the label. */
		icon?: IconData;
		/** The label or the count. */
		children?: Snippet;
	}

	let {
		variant = 'soft',
		size = 'md',
		textSize,
		shape = 'round',
		dot = false,
		icon,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const heightClasses = {
		sm: 'h-md',
		md: 'h-bs',
		lg: 'h-lg'
	};
	const textClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-md'
	};

	const classes = $derived([
		'badge inline-flex xcenter ycenter gap-xs tabular-nums',
		variant,
		heightClasses[size], textClasses[textSize ?? size],
		shape,
		klass
	]);
</script>

<span class={classes} {...rest}>
	{#if dot}
		<span class="dot" aria-hidden="true"></span>
	{/if}
	{#if icon}
		<Icon {icon} />
	{/if}
	{@render children?.()}
</span>
