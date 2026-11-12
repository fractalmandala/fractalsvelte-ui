<!-- @component A multi-line text field that can grow with its content, with a live character counter. -->

<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { vars } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'rows' | 'maxlength' | 'children'> {
		/** The text. Bindable; works controlled and uncontrolled. */
		value?: string;
		/** Called with the new text whenever it changes. */
		onValueChange?: (value: string) => void;
		/** The text scale. The height follows the content and `rows`. `textSize` overrides this. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the field invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** Grows the field with its text using CSS `field-sizing: content`, between `rows` and `maxRows` lines. */
		autosize?: boolean;
		/** The number of visible lines — the fixed height, or the minimum when `autosize` is on. */
		rows?: number;
		/** The most lines an autosizing field grows to before it scrolls. */
		maxRows?: number;
		/** The most characters allowed. */
		maxlength?: number;
		/** Shows a live character count under the field; with `maxlength` it reads `count / max`. */
		counter?: boolean;
		/** Which directions the user can drag-resize the field. Autosizing fields do not resize. */
		resize?: 'none' | 'vertical' | 'horizontal' | 'both';
		/** The underlying `<textarea>` element. Bindable. */
		ref?: HTMLTextAreaElement | null;
	}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		textSize,
		shape,
		variant,
		invalid,
		autosize = false,
		rows = 3,
		maxRows,
		maxlength,
		counter = false,
		resize = 'vertical',
		ref = $bindable(null),
		id,
		required,
		disabled,
		class: klass,
		oninput,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const counterId = `${uid}-count`;
	const control = useFieldControl(uid, () => ({
		id,
		invalid,
		required,
		disabled,
		describedby: [describedby, counter ? counterId : null].filter(Boolean).join(' ') || null,
		size,
		shape,
		variant
	}));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');

	const frame = $derived(frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled, content: true }));
	const resizeClass = { none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize-both' };
	const length = $derived(value.length);
	const atLimit = $derived(maxlength !== undefined && length >= maxlength);

	/** Where `field-sizing` is missing, mirror the content height into --fit. */
	function fit(_text: string): Attachment<HTMLTextAreaElement> {
		return (node) => {
			if (CSS.supports('field-sizing', 'content')) return;
			node.style.setProperty('--fit', '0');
			node.style.setProperty('--fit', String(node.scrollHeight));
		};
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }): void {
		value = event.currentTarget.value;
		onValueChange?.(value);
		oninput?.(event);
	}
</script>

<div class={['box gap-xs wfull', klass]}>
	<div role="presentation" class={frame} onpointerdown={(event) => focusFrame(event, ref)}>
		<textarea
			bind:this={ref}
			class={['bare grow wmin0', autosize ? 'autosize' : resizeClass[resize]]}
			id={control.id}
			{value}
			rows={autosize ? undefined : rows}
			{maxlength}
			disabled={control.disabled}
			required={control.required}
			aria-invalid={control.invalid || undefined}
			aria-describedby={control.describedby}
			oninput={handleInput}
			{@attach autosize ? vars({ rows, 'max-rows': maxRows }) : undefined}
			{@attach autosize ? fit(value) : undefined}
			{...rest}
		></textarea>
	</div>
	{#if counter}
		<span id={counterId} class={['text-xs tabular-nums ta-r', atLimit ? 'text-danger' : 'text-muted']}>
			{length}{maxlength !== undefined ? ` / ${maxlength}` : ''}
			<span class="sr-only">characters</span>
		</span>
	{/if}
</div>
