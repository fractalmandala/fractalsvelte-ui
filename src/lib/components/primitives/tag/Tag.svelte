<!-- @component A token that labels, filters or links, with an optional remove control. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { type Shape, type Size, type TextSize, type Variant } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		shape?: Shape;
		icon?: IconData;
		removable?: boolean;
		removeLabel?: string;
		onRemove?: () => void;
		href?: string;
		children?: Snippet;
	}

	let {
		variant = 'secondary',
		size = 'h-bs',
		textSize,
		shape = 'modern',
		icon,
		removable = false,
		removeLabel = 'Remove',
		onRemove,
		href,
		class: className,
		children,
		...rest
	}: Props = $props();


	const classes = $derived([
		'tag inline-flex xcenter gap-xs',
		variant,
		size, textSize,
		shape,
		href && 'link-plain focus-ring',
		className
	]);
</script>

<svelte:element this={href ? 'a' : 'span'} class={classes} {href} {...rest}>
	{#if icon}
		<Icon {icon} />
	{/if}
	{@render children?.()}
	{#if removable && !href}
		<button
			type="button"
			class="bare tag-remove inline-flex xcenter ycenter radius-full focus-ring"
			aria-label={removeLabel}
			onclick={onRemove}
		>
			<Icon icon={luX} />
		</button>
	{/if}
</svelte:element>
