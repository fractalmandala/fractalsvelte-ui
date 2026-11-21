<!-- @component A two-state button that stays pressed until pressed again. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { press } from '../../../motion/index.js';
	import { type Gap, type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLButtonAttributes, 'disabled'> {
		pressed?: boolean;
		onPressedChange?: (pressed: boolean) => void;
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		gap?: Gap;
		shape?: Shape;
		icon?: IconData;
		pressable?: boolean;
		children?: Snippet;
			disabled?: boolean | null;
}

	let {
		pressed = $bindable(false),
		onPressedChange,
		variant = 'ghost',
		size = 'h-lg',
		textSize,
		textColor,
		gap = 'gap-sm',
		shape = 'modern',
		icon,
		pressable = true,
		type = 'button',
		class: className,
		onclick,
		children,
		...rest
	}: Props = $props();

	const iconOnly = $derived(!children);

	function toggle(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(event);
		if (event.defaultPrevented) return;
		pressed = !pressed;
		onPressedChange?.(pressed);
	}
</script>

<button
	class={[
		'button no-scaling weight-500 inline-flex',
		gap,
		variant,
		size, textSize,
		shape,
		iconOnly && 'btn-icon',
		variant === 'secondary' && pressed && 'selected',
		pressable && 'motion',
		className
	]}
	{type}
	aria-pressed={pressed}
	onclick={toggle}
	{@attach pressable ? press() : undefined}
	{...rest}
>
	{#if icon}
		<Icon {icon} />
	{/if}
	{@render children?.()}
</button>
