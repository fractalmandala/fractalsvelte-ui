<!-- @component A set of toggles where one or several can be on, with arrow-key navigation. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/roving.js';
	import type { Orientation, Shape, Size, Variant } from '../../../internal/tokens.js';
	import { setToggleGroup } from './toggle-group.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** `single` keeps at most one item on; `multiple` lets any number be on. */
		type?: 'single' | 'multiple';
		/** The pressed item values: a string for `single` (empty when none), a string array for `multiple`. Bindable. */
		value?: string | string[];
		/** Called with the new value whenever the selection changes. */
		onValueChange?: (value: string | string[]) => void;
		/** The visual style of every item. */
		variant?: Variant;
		/** The control height and text scale of every item. */
		size?: Size;
		/** The corner shape of every item. */
		shape?: Shape;
		/** The direction items run in, and which arrow keys move focus. */
		orientation?: Orientation;
		/** Joins the items into one segmented control. When false they sit apart with a small gap. */
		attached?: boolean;
		/** Disables every item. */
		disabled?: boolean;
		/** The accessible name of the group. */
		label?: string;
		/** The `ToggleGroupItem` children. */
		children?: Snippet;
	}

	let {
		type = 'single',
		value = $bindable(),
		onValueChange,
		variant = 'outline',
		size = 'md',
		shape = 'modern',
		orientation = 'horizontal',
		attached = true,
		disabled = false,
		label,
		class: klass,
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
				type === 'multiple'
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
		klass
	]}
	{@attach roving({ orientation, selector: '[data-roving]' })}
	{...rest}
>
	{@render children?.()}
</div>
