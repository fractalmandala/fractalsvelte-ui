<!-- @component A small status or count label on the shared variant and shape axes. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { type Shape, type Size, type TextSize, type Variant } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		shape?: Shape;
		dot?: boolean;
		icon?: IconData;
		children?: Snippet;
	}

	let {
		variant = 'secondary',
		size = 'h-bs',
		textSize,
		shape = 'modern',
		dot = false,
		icon,
		class: className,
		children,
		...rest
	}: Props = $props();


	const classes = $derived([
		'badge inline-flex xcenter ycenter gap-xs tabular-nums',
		variant,
		size, textSize,
		shape,
		className
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
