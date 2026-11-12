<!-- @component A two-state button that stays pressed until pressed again. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { press } from '../../../motion/index.js';
	import { controlSize, type Shape, type Size, type Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		/** Whether the toggle is on. Bindable; works controlled and uncontrolled. */
		pressed?: boolean;
		/** Called with the new state whenever the user toggles. */
		onPressedChange?: (pressed: boolean) => void;
		/** The visual style when off. When on, subtle variants fill and every variant gains an inset ring. */
		variant?: Variant;
		/** The control height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** An icon drawn before the label. With no label, set `aria-label`. */
		icon?: IconData;
		/** Springs the toggle down under the pointer. Turn off for a still toggle. */
		pressable?: boolean;
		/** The label. Omit it for an icon-only toggle. */
		children?: Snippet;
	}

	let {
		pressed = $bindable(false),
		onPressedChange,
		variant = 'ghost',
		size = 'md',
		textSize,
		shape = 'modern',
		icon,
		pressable = true,
		type = 'button',
		class: klass,
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
		'button no-scaling gap-sm weight-500 inline-flex',
		variant,
		controlSize(size, textSize),
		shape,
		iconOnly && 'btn-icon',
		variant === 'soft' && pressed && 'selected',
		pressable && 'motion',
		klass
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
