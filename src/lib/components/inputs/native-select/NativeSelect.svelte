<!-- @component A styled native select in the same field frame as Input, with options, optgroups and a chevron. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLSelectAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import { defaultSize, type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';
	import { isNativeSelectGroup, type NativeSelectItem } from './options.js';

	interface Props extends Omit<HTMLSelectAttributes, 'size' | 'value' | 'children' | 'disabled'> {
		value?: string;
		onValueChange?: (value: string) => void;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		invalid?: boolean;
		placeholder?: string;
		options?: NativeSelectItem[];
		ref?: HTMLSelectElement | null;
		children?: Snippet;
			disabled?: boolean | null;
}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		textSize,
		textColor = 'text-muted',
		shape,
		variant,
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
	const control = useFieldControl(uid, () => ({ id, invalid, required, disabled, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived<Variant>(variant ?? control.variant ?? 'outline');

	const classes = $derived([
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled }),
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
	<Icon icon={luChevronDown} class={[textColor, 'shrink-0']} />
</div>
