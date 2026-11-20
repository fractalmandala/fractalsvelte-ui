<!-- @component Triggers an action or navigates, with a spring-loaded press. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luLoaderCircle } from '@fractaldesign/icons/lucide';
	import { press } from '../../../motion/index.js';
	import { defaultTextColor } from '../../../internal/helpers.js';
	import { type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLButtonAttributes, 'disabled'> {
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		icon?: IconData;
		iconEnd?: IconData;
		leading?: Snippet;
		trailing?: Snippet;
		loading?: boolean;
		block?: boolean;
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		pressable?: boolean;
		children?: Snippet;
		disabled?: boolean | null;
}

	let {
		variant = 'primary',
		size = 'h-lg',
		textSize = 'text-md',
		textColor,
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
		class: className,
		children,
		...rest
	}: Props = $props();

	const inert = $derived(Boolean(disabled || loading));
	const resolvedTextColor = $derived(textColor ?? defaultTextColor(variant));
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
		class={['button row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', className]}
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
		class={['row ycenter xcenter gap-sm', variant, size, shape, textSize, resolvedTextColor, block && 'wfull', pressable && 'motion', className]}
		{type}
		disabled={inert}
		aria-busy={loading || undefined}
		{@attach spring}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
