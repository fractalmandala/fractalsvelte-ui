<!-- @component A set of native radios with a bindable value, as plain rows or selectable cards. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation, Size, TextSize } from '../../../internal/tokens.js';
	import { setRadioGroup } from './radio-group.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The value of the selected radio. Two-way bindable; `undefined` means nothing is selected. */
		value?: string;
		/** Called after the user picks a radio, with its value. */
		onValueChange?: (value: string) => void;
		/** Lays the radios out in a column (`vertical`) or a wrapping row (`horizontal`). */
		orientation?: Orientation;
		/** The field name shared by every radio; it groups them natively and is submitted with a form. Generated when omitted. */
		name?: string;
		/** `default` is a radio dot beside a label; `card` is a selectable bordered card with a title and description. */
		variant?: 'default' | 'card';
		/** The radio and text scale. */
		size?: Size;
		/** The text scale of every label, independent of the control. Follows `size` when omitted. */
		textSize?: TextSize;
		/** Disables every radio in the group. */
		disabled?: boolean;
		/** Marks the group as failing validation. */
		invalid?: boolean;
		/** The `Radio` parts. */
		children?: Snippet;
	}

	let {
		value = $bindable(),
		onValueChange,
		orientation = 'vertical',
		name,
		variant = 'default',
		size = 'h-lg',
		textSize,
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
	class={[orientation === 'horizontal' ? 'row wrap' : 'column', variant === 'card' ? 'gap-sm' : 'gap-md', className]}
	{...rest}
>
	{@render children?.()}
</div>
