<!-- @component A segmented time field whose hour, minute and optional second are edited with the keyboard. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { defaultSize, controlSize, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import Segments from '../date-field/internal/Segments.svelte';
	import type { HourCycle, TimeGranularity } from '../date-field/segments.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The chosen time as ISO `HH:mm` or `HH:mm:ss`, or `null` while any required segment is empty. Bindable. */
		value?: string | null;
		/** Called whenever the person changes the time, or clears a required segment. */
		onValueChange?: (value: string | null) => void;
		/** The earliest selectable ISO time. */
		min?: string;
		/** The latest selectable ISO time. */
		max?: string;
		/** BCP 47 locale for segment order, literals and AM/PM labels. */
		locale?: string;
		/** How complete a time must be to commit. Hour stores `HH:00`; minute stores `HH:mm`; second stores `HH:mm:ss`. */
		granularity?: TimeGranularity;
		/** 12-hour (with a localized AM/PM segment) or 24-hour clock. Defaults from the locale. */
		hourCycle?: HourCycle;
		/** ISO time used when a person first increments an empty segment. Defaults to midnight. */
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
		/** The name of the hidden input that carries the ISO time in a form submission. */
		name?: string;
	}

	let {
		value = $bindable(null),
		onValueChange,
		min,
		max,
		locale,
		granularity = 'minute',
		hourCycle,
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
		kind="time"
		bind:value
		{onValueChange}
		{min}
		{max}
		{locale}
		timeGranularity={granularity}
		{hourCycle}
		{placeholder}
		disabled={Boolean(disabled)}
		{readonly}
		invalid={resolvedInvalid}
	/>
</div>

{#if name}
	<input type="hidden" {name} value={value ?? ''} disabled={disabled || undefined} />
{/if}
