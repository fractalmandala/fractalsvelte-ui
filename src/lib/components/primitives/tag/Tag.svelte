<!-- @component A token that labels, filters or links, with an optional remove control. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import type { Shape, Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The visual style, from the shared variant axis. `soft` is the quiet default. */
		variant?: Variant;
		/** The token height. Text follows this unless `textSize` is set. */
		size?: 'sm' | 'md' | 'lg';
		/** The text scale, independent of the tag height. Follows `size` when omitted. */
		textSize?: 'sm' | 'md' | 'lg';
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
		variant = 'soft',
		size = 'md',
		textSize,
		shape = 'mincurved',
		icon,
		removable = false,
		removeLabel = 'Remove',
		onRemove,
		href,
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
		'tag inline-flex xcenter gap-xs',
		variant,
		heightClasses[size], textClasses[textSize ?? size],
		shape,
		href && 'link-plain focus-ring',
		klass
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
