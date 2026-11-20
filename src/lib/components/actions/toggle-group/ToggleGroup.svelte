<!-- @component A set of toggles where one or several can be on, with arrow-key navigation. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/helpers.js';
import type { Orientation, Shape, Size, TextColor, TextSize, Variant } from '../../../internal/tokens.js';
	import { setToggleGroup } from './toggle-group.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		multiple?: boolean;
		value?: string | string[];
		onValueChange?: (value: string | string[]) => void;
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		orientation?: Orientation;
		attached?: boolean;
		disabled?: boolean;
		label?: string;
		children?: Snippet;
	}

	let {
		multiple = false,
		value = $bindable(),
		onValueChange,
		variant = 'outline',
		size = 'h-lg',
		textSize,
		textColor,
		shape = 'modern',
		orientation = 'horizontal',
		attached = true,
		disabled = false,
		label,
		class: className,
		children,
		...rest
	}: Props = $props();

	const selected = $derived(
		Array.isArray(value) ? value : typeof value === 'string' && value !== '' ? [value] : []
	);
	const vertical = $derived(orientation === 'vertical');

	setToggleGroup({
		get variant() {
			return variant;
		},
		get size() {
			return size;
		},
		get textSize() {
			return textSize;
		},
		get textColor() {
			return textColor;
		},
		get shape() {
			return shape;
		},
		get disabled() {
			return disabled;
		},
		isPressed: (item) => selected.includes(item),
		toggle(item) {
			const on = selected.includes(item);
			const next =
				multiple
					? on
						? selected.filter((v) => v !== item)
						: [...selected, item]
					: on
						? ''
						: item;
			value = next;
			onValueChange?.(next);
		}
	});
</script>

<div
	role="group"
	aria-label={label}
	class={[
		attached ? 'button-group' : vertical ? 'box gap-sm' : 'row wrap gap-sm',
		attached && vertical && 'vertical',
		className
	]}
	{@attach roving({ orientation, selector: '[data-roving]' })}
	{...rest}
>
	{@render children?.()}
</div>
