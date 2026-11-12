<!-- @component Triggers an action or navigates, with a spring-loaded press. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luLoaderCircle } from '@fractaldesign/icons/lucide';
	import { press } from '../../../motion/index.js';
	import { controlSize, type Shape, type Size, type Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		/** The visual style. `primary` is the page's main action; use one per view. */
		variant?: Variant;
		/** The control height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** An icon drawn before the label. */
		icon?: IconData;
		/** An icon drawn after the label. */
		iconEnd?: IconData;
		/** Content drawn before the label, after a leading icon. */
		leading?: Snippet;
		/** Content drawn after the label, before a trailing icon. */
		trailing?: Snippet;
		/** Shows a spinner in place of the leading icon and blocks interaction, keeping the button's width. */
		loading?: boolean;
		/** Stretches the button to the full width of its container. */
		block?: boolean;
		/** Renders an `<a>` that looks like a button. Use for navigation. */
		href?: string;
		/** Where to open the link, when `href` is set. */
		target?: HTMLAnchorAttributes['target'];
		/** Springs the button down under the pointer. Turn off for a still button. */
		pressable?: boolean;
		/** The label. */
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		textSize,
		shape = 'modern',
		icon,
		iconEnd,
		leading,
		trailing,
		loading = false,
		block = false,
		href,
		target,
		pressable = true,
		disabled,
		type = 'button',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const inert = $derived(Boolean(disabled || loading));
	const classes = $derived([
		'button no-scaling gap-sm weight-500',
		variant,
		controlSize(size, textSize),
		shape,
		block ? 'wfull' : 'inline-flex',
		pressable && 'motion',
		klass
	]);
	const spring = $derived(pressable ? press() : undefined);
</script>

{#snippet content()}
	{#if loading}
		<Icon icon={luLoaderCircle} class="anim-spin" />
	{:else if icon}
		<Icon {icon} />
	{/if}
	{@render leading?.()}
	{@render children?.()}
	{@render trailing?.()}
	{#if iconEnd}
		<Icon icon={iconEnd} />
	{/if}
{/snippet}

{#if href}
	<a
		class={classes}
		href={inert ? undefined : href}
		{target}
		rel={target === '_blank' ? 'noopener noreferrer' : undefined}
		aria-disabled={inert ? 'true' : undefined}
		tabindex={inert ? -1 : undefined}
		aria-busy={loading || undefined}
		{@attach spring}
		{...rest as HTMLAnchorAttributes}
	>
		{@render content()}
	</a>
{:else}
	<button
		class={classes}
		{type}
		disabled={inert}
		aria-busy={loading || undefined}
		{@attach spring}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
