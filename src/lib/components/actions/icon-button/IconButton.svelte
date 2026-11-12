<!-- @component A square, icon-only button with a required accessible label. -->

<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luLoaderCircle } from '@fractaldesign/icons/lucide';
	import { press } from '../../../motion/index.js';
	import { sizeClass, type Shape, type Size, type Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		/** The icon drawn in the button. */
		icon: IconData;
		/** The accessible name. Required, because the button has no visible text; it is also announced as the tooltip text. */
		label: string;
		/** The visual style. */
		variant?: Variant;
		/** The control height; the button is always square. */
		size?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** Shows a spinner in place of the icon and blocks interaction. */
		loading?: boolean;
		/** Renders an `<a>` that looks like an icon button. Use for navigation. */
		href?: string;
		/** Where to open the link, when `href` is set. */
		target?: HTMLAnchorAttributes['target'];
		/** Springs the button down under the pointer. Turn off for a still button. */
		pressable?: boolean;
	}

	let {
		icon,
		label,
		variant = 'ghost',
		size = 'md',
		shape = 'modern',
		loading = false,
		href,
		target,
		pressable = true,
		disabled,
		type = 'button',
		class: klass,
		...rest
	}: Props = $props();

	const classes = $derived([
		'button btn-icon no-scaling',
		variant,
		sizeClass[size],
		shape,
		'inline-flex',
		pressable && 'motion',
		klass
	]);
	const spring = $derived(pressable ? press() : undefined);
</script>

{#snippet glyph()}
	<Icon icon={loading ? luLoaderCircle : icon} class={loading ? 'anim-spin' : undefined} />
{/snippet}

{#if href && !disabled}
	<a
		class={classes}
		{href}
		{target}
		rel={target === '_blank' ? 'noopener noreferrer' : undefined}
		aria-label={label}
		title={label}
		aria-busy={loading || undefined}
		{@attach spring}
		{...rest as HTMLAnchorAttributes}
	>
		{@render glyph()}
	</a>
{:else}
	<button
		class={classes}
		{type}
		disabled={disabled || loading}
		aria-label={label}
		title={label}
		aria-busy={loading || undefined}
		{@attach spring}
		{...rest}
	>
		{@render glyph()}
	</button>
{/if}
