<!-- @component A styled native select in the same field frame as Input, with options, optgroups and a chevron. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import { defaultSize, type Shape, type Size, type TextSize } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';
	import { isNativeSelectGroup, type NativeSelectItem } from './options.js';

	interface Props extends Omit<HTMLSelectAttributes, 'size' | 'value' | 'children' | 'disabled'> {
		/** The selected value. Bindable; works controlled and uncontrolled. */
		value?: string;
		/** Called with the new value whenever the selection changes. */
		onValueChange?: (value: string) => void;
		/** The control height. Text follows this unless `textSize` is set. @default 'lg' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: TextSize;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		look?: 'outline' | 'filled' | 'ghost';
		/** Marks the select invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** A disabled first option shown when no value is selected, such as "Choose a region". */
		placeholder?: string;
		/** Options and optgroups to render. When omitted, pass `<option>` and `<optgroup>` as children. */
		options?: NativeSelectItem[];
		/** The underlying `<select>` element. Bindable, for focusing from code. */
		ref?: HTMLSelectElement | null;
		/** Custom `<option>` and `<optgroup>` elements, used when `options` is omitted. */
		children?: Snippet;
			/** Blocks pointer and keyboard input, and dims the frame. */
		disabled?: boolean | null;
}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		textSize,
		shape,
		look,
		invalid,
		placeholder,
		options,
		ref = $bindable(null),
		id,
		required,
		disabled,
		class: className,
		onchange,
		'aria-describedby': describedby,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, required, disabled, describedby, size, shape, look }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(look ?? control.look ?? 'outline');

	const classes = $derived([
		frameClasses({ look: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled }),
		className
	]);

	function set(next: string): void {
		value = next;
		onValueChange?.(next);
	}

	function handleChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }): void {
		set(event.currentTarget.value);
		onchange?.(event);
	}
</script>

<div role="presentation" class={classes} onpointerdown={(event) => focusFrame(event, ref)}>
	<select
		bind:this={ref}
		class="bare grow wmin0 hfull"
		id={control.id}
		{value}
		disabled={control.disabled}
		required={control.required}
		aria-invalid={control.invalid || undefined}
		aria-describedby={control.describedby}
		onchange={handleChange}
		{...rest}
	>
		{#if placeholder}
			<option value="" disabled hidden>{placeholder}</option>
		{/if}
		{#if options}
			{#each options as item (isNativeSelectGroup(item) ? `g:${item.label}` : item.value)}
				{#if isNativeSelectGroup(item)}
					<optgroup label={item.label}>
						{#each item.options as option (option.value)}
							<option value={option.value} disabled={option.disabled}>{option.label}</option>
						{/each}
					</optgroup>
				{:else}
					<option value={item.value} disabled={item.disabled}>{item.label}</option>
				{/if}
			{/each}
		{:else}
			{@render children?.()}
		{/if}
	</select>
	<Icon icon={luChevronDown} class="text-muted shrink-0" />
</div>
