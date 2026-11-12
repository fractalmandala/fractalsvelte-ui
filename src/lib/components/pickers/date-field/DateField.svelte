<!-- @component A segmented date field whose day, month and year are edited with the keyboard, in locale order. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { defaultSize, controlSize, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import Segments from './internal/Segments.svelte';
	import type { DateGranularity } from './segments.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The chosen date as ISO `YYYY-MM-DD`, or `null` while any required segment is empty. Bindable. */
		value?: string | null;
		/** Called whenever the person changes the date, or clears a required segment. */
		onValueChange?: (value: string | null) => void;
		/** The earliest selectable ISO date. */
		min?: string;
		/** The latest selectable ISO date. */
		max?: string;
		/** BCP 47 locale for segment order, literals and placeholders. */
		locale?: string;
		/** How complete a date must be to commit. Year commits `YYYY-01-01`; month commits `YYYY-MM-01`. */
		granularity?: DateGranularity;
		/** ISO date used when a person first increments an empty segment. Defaults to today. */
		placeholder?: string;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the field. @default 'modern' */
		shape?: Shape;
		/** Marks the field as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** Prevents edits; segments remain focusable. */
		readonly?: boolean;
		/** Prevents focus and edits. */
		disabled?: boolean;
		/** The name of the hidden input that carries the ISO date in a form submission. */
		name?: string;
	}

	let {
		value = $bindable(null),
		onValueChange,
		min,
		max,
		locale,
		granularity = 'day',
		placeholder,
		size,
		textSize,
		shape,
		invalid,
		readonly = false,
		name,
		disabled = false,
		id,
		class: klass,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);
</script>

<div
	{id}
	role="group"
	class={[
		'field relative row ycenter bg-input border px-md font-sans tabular-nums',
		controlSize(resolvedSize, textSize),
		resolvedShape,
		resolvedInvalid && 'is-invalid',
		disabled && 'disabled',
		klass
	]}
	aria-disabled={disabled || undefined}
	{...rest}
>
	<Segments
		kind="date"
		bind:value
		{onValueChange}
		{min}
		{max}
		{locale}
		dateGranularity={granularity}
		{placeholder}
		disabled={Boolean(disabled)}
		{readonly}
		invalid={resolvedInvalid}
	/>
</div>

{#if name}
	<input type="hidden" {name} value={value ?? ''} disabled={disabled || undefined} />
{/if}
