<!-- @component The form-field wrapper: a label, a control, helper text and an error, wired together for assistive technology. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { springFade } from '../../../motion/index.js';
	import type { 
		ChildTextColor,
		ChildTextSize,
		Gap,
		Measure,
		Orientation,
		Shape,
		Size,
		TextColor,
		TextSize,
		Variant
	 } from '../../../internal/tokens.js';
	import { setFieldContext } from './field.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
		label?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		orientation?: Orientation;
		gap?: Gap;
		size?: Size;
		shape?: Shape;
		variant?: Variant;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		measure?: Measure;
		id?: string;
		children?: Snippet;
	}

	let {
		label,
		hint,
		error,
		required = false,
		disabled = false,
		orientation = 'vertical',
		gap,
		size,
		shape = 'modern',
		variant,
		textSize = 'text-sm',
		textColor = 'text-primary',
		childTextSize,
		childTextColor,
		measure = 'measure-xs',
		id,
		class: className,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const controlId = $derived(id ?? `${uid}-control`);
	const labelId = $derived(label ? `${uid}-label` : undefined);
	const hintId = $derived(hint && !error ? `${uid}-hint` : undefined);
	const errorId = $derived(error ? `${uid}-error` : undefined);

	setFieldContext({
		get controlId() {
			return controlId;
		},
		get labelId() {
			return labelId;
		},
		get describedBy() {
			return errorId ?? hintId;
		},
		get invalid() {
			return Boolean(error);
		},
		get required() {
			return required;
		},
		get disabled() {
			return disabled;
		},
		get size() {
			return size;
		},
		get shape() {
			return shape;
		},
		get variant() {
			return variant;
		}
	});

	const horizontal = $derived(orientation === 'horizontal');
	const resolvedChildTextSize = $derived(childTextSize ?? textSize);
	const resolvedChildTextColor = $derived(childTextColor ?? (error ? 'text-danger' : 'text-muted'));
	const labelHeight = $derived(size ?? 'h-lg');
	const layout = $derived(horizontal ? 'row' : 'box');
	const layoutGap = $derived(gap ?? (horizontal ? 'gap-lg' : 'gap-xs'));
</script>

<div class={[layout, layoutGap, 'wfull ta-l', className]} {...rest}>
	{#if label}
		<label
			id={labelId}
			for={controlId}
			class={[
				'row gap-xs weight-500',
				textSize,
				textColor,
				horizontal && [measure, 'shrink-0', labelHeight],
				disabled && 'dim'
			]}
		>
			{label}
			{#if required}
				<span class="tone-danger text-theme" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}
	<div class={['box gap-xs', horizontal && 'grow wmin0']}>
		{@render children?.()}
		<div aria-live="polite" class="box">
			{#if error}
				<p id={errorId} class={[resolvedChildTextSize, resolvedChildTextColor]} transition:springFade>{error}</p>
			{:else if hint}
				<p id={hintId} class={[resolvedChildTextSize, resolvedChildTextColor]}>{hint}</p>
			{/if}
		</div>
	</div>
</div>
