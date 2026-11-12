<!-- @component Two segmented date fields in one frame, for typing a start and an end date in locale order. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { defaultSize, controlSize, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import type { DateRange } from '../calendar/dates.js';
	import Segments from '../date-field/internal/Segments.svelte';
	import type { DateGranularity } from '../date-field/segments.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The inclusive start and end dates as ISO `YYYY-MM-DD`, either of which may be `null`. Bindable. */
		value?: DateRange;
		/** Called whenever the person changes either side of the range. */
		onValueChange?: (value: DateRange) => void;
		/** The earliest selectable ISO date, applied to both sides. */
		min?: string;
		/** The latest selectable ISO date, applied to both sides. */
		max?: string;
		/** BCP 47 locale for segment order, literals and placeholders. */
		locale?: string;
		/** How complete each date must be to commit. Year commits `YYYY-01-01`; month commits `YYYY-MM-01`. */
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
		/** The name of the hidden inputs (`-start` and `-end` suffixes) that carry the range in a form. */
		name?: string;
	}

	let {
		value = $bindable({ start: null, end: null }),
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

	const range = $derived(value ?? { start: null, end: null });

	function setStart(next: string | null) {
		const updated = { start: next, end: range.end };
		value = updated;
		onValueChange?.(updated);
	}

	function setEnd(next: string | null) {
		const updated = { start: range.start, end: next };
		value = updated;
		onValueChange?.(updated);
	}
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
		value={range.start}
		onValueChange={setStart}
		{min}
		{max}
		{locale}
		dateGranularity={granularity}
		{placeholder}
		disabled={Boolean(disabled)}
		{readonly}
		invalid={resolvedInvalid}
		label="Start"
	/>
	<span class="text-muted px-xs" aria-hidden="true">–</span>
	<Segments
		kind="date"
		value={range.end}
		onValueChange={setEnd}
		{min}
		{max}
		{locale}
		dateGranularity={granularity}
		{placeholder}
		disabled={Boolean(disabled)}
		{readonly}
		invalid={resolvedInvalid}
		label="End"
	/>
</div>

{#if name}
	<input type="hidden" name={`${name}-start`} value={range.start ?? ''} disabled={disabled || undefined} />
	<input type="hidden" name={`${name}-end`} value={range.end ?? ''} disabled={disabled || undefined} />
{/if}
