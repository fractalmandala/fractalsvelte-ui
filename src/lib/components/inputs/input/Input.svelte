<!-- @component A single-line text input in a framed field, with icons, prefixes, suffixes and a clear button. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLInputAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from './frame.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'children' | 'disabled'> {
		value?: string;
		onValueChange?: (value: string) => void;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		invalid?: boolean;
		icon?: IconData;
		leading?: Snippet;
		trailing?: Snippet;
		clearable?: boolean;
		ref?: HTMLInputElement | null;
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
		icon,
		leading,
		trailing,
		clearable = false,
		ref = $bindable(null),
		id,
		type = 'text',
		required,
		disabled,
		readonly,
		class: className,
		oninput,
		onkeydown,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, required, disabled, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived<Variant>(variant ?? control.variant ?? 'outline');
	const classes = $derived([
		...frameClasses({
			variant: resolvedVariant,
			size: resolvedSize,
			textSize,
			shape: resolvedShape,
			invalid: control.invalid,
			disabled: control.disabled
		}),
		className
	]);


	const canClear = $derived(clearable && value !== '' && !control.disabled && !readonly);
	const clearSize = $derived(size ?? 'h-md');

	function set(next: string): void {
		value = next;
		onValueChange?.(next);
	}

	function clear(): void {
		set('');
		ref?.focus();
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }): void {
		set(event.currentTarget.value);
		oninput?.(event);
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		if (event.key === 'Escape' && canClear) {
			event.preventDefault();
			event.stopPropagation();
			set('');
		}
	}

</script>

<div role="presentation" class={classes} onpointerdown={(event) => focusFrame(event, ref)}>
	{#if icon}
		<Icon {icon} class={[textColor, 'shrink-0']} />
	{/if}
	{@render leading?.()}
	<input
		bind:this={ref}
		class="bare grow wmin0 hfull"
		id={control.id}
		{type}
		{value}
		disabled={control.disabled}
		required={control.required}
		{readonly}
		aria-invalid={control.invalid || undefined}
		aria-describedby={control.describedby}
		oninput={handleInput}
		onkeydown={handleKeydown}
		{...rest}
	/>
	{@render trailing?.()}
	{#if canClear}
		<button
			type="button"
			class={['bare row ycenter xcenter shrink-0 square radius-full hover-fill press', clearSize, textColor]}
			aria-label="Clear"
			tabindex="-1"
			onclick={clear}
			transition:springScale={{ start: 0.6 }}
		>
			<Icon icon={luX} />
		</button>
	{/if}
</div>
