<!-- @component The form-field wrapper: a label, a control, helper text and an error, wired together for assistive technology. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { springFade } from '../../../motion/index.js';
	import type { Orientation, Shape, Size } from '../../../internal/tokens.js';
	import { setFieldContext, type FieldVariant } from './field.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
		/** The label text. It is a real `<label>` bound to the control, and doubles as the accessible name of grouped controls. */
		label?: string;
		/** Helper text shown under the control and read after its name. Replaced by `error` while there is one. */
		hint?: string;
		/** An error message. Marks the control invalid and is announced politely when it appears. */
		error?: string;
		/** Marks the control required and adds a marker beside the label. */
		required?: boolean;
		/** Disables the control inside and dims the label. */
		disabled?: boolean;
		/** Whether the label sits above the control or to its side. */
		orientation?: Orientation;
		/** The control height and text scale, inherited by the control inside unless it sets its own. */
		size?: Size;
		/** The corner shape, inherited by the control inside unless it sets its own. */
		shape?: Shape;
		/** The field look, inherited by the control inside unless it sets its own. */
		variant?: FieldVariant;
		/** The id given to the control inside. Generated when omitted. */
		id?: string;
		/** The control. Inputs in this kit pick up the id, description and invalid state automatically. */
		children?: Snippet;
	}

	let {
		label,
		hint,
		error,
		required = false,
		disabled = false,
		orientation = 'vertical',
		size,
		shape,
		variant,
		id,
		class: klass,
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
</script>

<div class={[horizontal ? 'row gap-lg' : 'box gap-xs', 'wfull', klass]} {...rest}>
	{#if label}
		<label
			id={labelId}
			for={controlId}
			class={['row ycenter gap-xs text-sm weight-500 text-primary', horizontal && 'measure-xs shrink-0 h-lg', disabled && 'dim']}
		>
			{label}
			{#if required}
				<span class="text-danger" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}
	<div class={['box gap-xs', horizontal && 'grow wmin0']}>
		{@render children?.()}
		<div aria-live="polite" class="box">
			{#if error}
				<p id={errorId} class="text-sm text-danger" transition:springFade>{error}</p>
			{:else if hint}
				<p id={hintId} class="text-sm text-muted">{hint}</p>
			{/if}
		</div>
	</div>
</div>
