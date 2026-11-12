<!-- @component A single-line text input in a framed field, with icons, prefixes, suffixes and a clear button. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from './frame.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'children'> {
		/** The text. Bindable; works controlled and uncontrolled. */
		value?: string;
		/** Called with the new text whenever it changes, including when it is cleared. */
		onValueChange?: (value: string) => void;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the input invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** An icon drawn at the start of the field. */
		icon?: IconData;
		/** Content drawn at the start of the field, after the icon — a prefix such as a currency or protocol. */
		leading?: Snippet;
		/** Content drawn at the end of the field, before the clear button — a unit, a shortcut hint, a spinner. */
		trailing?: Snippet;
		/** Shows a clear button while the input has text. Escape clears it too. */
		clearable?: boolean;
		/** The underlying `<input>` element. Bindable, for focusing from code. */
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		textSize,
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
		class: klass,
		oninput,
		onkeydown,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, required, disabled, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');


	const classes = $derived([
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled }),
		klass
	]);
	const canClear = $derived(clearable && value !== '' && !control.disabled && !readonly);

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
		<Icon {icon} class="text-muted shrink-0" />
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
			class="bare row ycenter xcenter shrink-0 square h-md radius-full text-muted hover-fill press"
			aria-label="Clear"
			tabindex="-1"
			onclick={clear}
			transition:springScale={{ start: 0.6 }}
		>
			<Icon icon={luX} />
		</button>
	{/if}
</div>
