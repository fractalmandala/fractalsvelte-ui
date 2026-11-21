<!-- @component A multi-line text field that can grow with its content, with a live character counter. -->

<script lang="ts">
	import type {  HTMLTextareaAttributes  } from 'svelte/elements';
	import type {  Attachment  } from 'svelte/attachments';
	import { vars } from '../../../motion/index.js';
	import { defaultSize, type Gap, type Resize, type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'rows' | 'maxlength' | 'children' | 'disabled'> {
		value?: string;
		onValueChange?: (value: string) => void;
		size?: Size;
		gap?: Gap;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		invalid?: boolean;
		autosize?: boolean;
		rows?: number;
		maxRows?: number;
		maxlength?: number;
		counter?: boolean;
		resize?: Resize;
		ref?: HTMLTextAreaElement | null;
			disabled?: boolean | null;
}

	let {
		value = $bindable(''),
		onValueChange,
		size,
		gap = 'gap-xs',
		textSize,
		textColor = 'text-muted',
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
		class: className,
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
	const resolvedVariant = $derived<Variant>(variant ?? control.variant ?? 'outline');

	const frame = $derived(frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled, content: true }));
	const resizeClass: Record<Resize, string> = { none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize-both' };
	const counterText = $derived(textSize ?? 'text-xs');
	const length = $derived(value.length);
	const atLimit = $derived(maxlength !== undefined && length >= maxlength);

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

<div class={['box', gap, 'wfull', className]}>
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
		<span id={counterId} class={[counterText, 'tabular-nums ta-r', atLimit ? 'tone-danger text-theme' : textColor]}>
			{length}{maxlength !== undefined ? ` / ${maxlength}` : ''}
			<span class="sr-only">characters</span>
		</span>
	{/if}
</div>
