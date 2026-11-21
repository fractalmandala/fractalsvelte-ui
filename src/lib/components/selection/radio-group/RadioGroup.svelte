<!-- @component A set of native radios with a bindable value, as plain rows or selectable cards. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  ChildTextSize, Gap, Orientation, Pad, Shape, Size, Surface, TextColor, TextSize  } from '../../../internal/tokens.js';
	import { setRadioGroup } from './radio-group.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: string;
		onValueChange?: (value: string) => void;
		orientation?: Orientation;
		name?: string;
		variant?: 'default' | 'card';
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		shape?: Shape;
		surface?: Surface;
		gap?: Gap;
		disabled?: boolean;
		invalid?: boolean;
		children?: Snippet;
	}

	let {
		value = $bindable(),
		onValueChange,
		orientation = 'vertical',
		name,
		variant = 'default',
		gap = variant === 'card' ? 'gap-sm' : 'gap-md',
		size = 'h-lg',
		textSize,
		childTextSize = 'text-sm',
		childTextColor = 'text-secondary',
		shape = 'modern',
		surface = 'elevated',
		disabled = false,
		invalid = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const id = $props.id();

	setRadioGroup({
		get name() {
			return name ?? `radio-${id}`;
		},
		get value() {
			return value;
		},
		get variant() {
			return variant;
		},
		get size() {
			return size;
		},
		get textSize() {
			return textSize;
		},
		get childTextSize() {
			return childTextSize;
		},
		get childTextColor() {
			return childTextColor;
		},
		get shape() {
			return shape;
		},
		get surface() {
			return surface;
		},
		get disabled() {
			return disabled;
		},
		get invalid() {
			return invalid;
		},
		select(next) {
			value = next;
			onValueChange?.(next);
		}
	});
</script>

<div
	role="radiogroup"
	aria-invalid={invalid || undefined}
	class={[orientation === 'horizontal' ? 'row wrap' : 'column', gap, className]}
	{...rest}
>
	{@render children?.()}
</div>
