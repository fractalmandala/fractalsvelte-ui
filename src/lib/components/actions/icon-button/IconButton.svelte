<!-- @component A square, icon-only button with a required accessible label. -->

<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luLoaderCircle } from '@fractaldesign/icons/lucide';
	import { press } from '../../../motion/index.js';
	import { defaultTextColor } from '../../../internal/helpers.js';
	import { type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLButtonAttributes, 'disabled'> {
		icon: IconData;
		label: string;
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		loading?: boolean;
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		pressable?: boolean;
			disabled?: boolean | null;
}

	let {
		icon,
		label,
		variant = 'ghost',
		size = 'h-lg',
		textSize,
		textColor,
		shape = 'modern',
		loading = false,
		href,
		target,
		pressable = true,
		disabled,
		type = 'button',
		class: className,
		...rest
	}: Props = $props();

	const resolvedTextColor = $derived(textColor ?? defaultTextColor(variant));
	const classes = $derived([
		'button btn-icon no-scaling',
		variant,
		size,
		textSize,
		resolvedTextColor,
		shape,
		'inline-flex',
		pressable && 'motion',
		className
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
