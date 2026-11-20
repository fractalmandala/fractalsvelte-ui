<!-- @component A token that labels, filters or links, with an optional remove control. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type Shape, type Size, type TextSize, type Variant } from '../../../internal/tokens.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The visual style, from the shared variant axis. */
		variant?: Variant;
		/** The token height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the tag height. Follows `size` when omitted. */
		textSize?: TextSize;
		/** The corner shape. */
		shape?: Shape;
		/** An icon drawn before the label. */
		icon?: IconData;
		/** Shows a remove control at the end of the tag. Ignored when `href` is set, because a link cannot hold a button. */
		removable?: boolean;
		/** The accessible name of the remove control. */
		removeLabel?: string;
		/** Called when the remove control is pressed. The tag does not remove itself: the owner decides. */
		onRemove?: () => void;
		/** Renders the tag as a link to this address. */
		href?: string;
		/** The label. */
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
