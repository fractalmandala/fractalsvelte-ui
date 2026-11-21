<!-- @component Two segmented time fields in one frame, for typing a start and an end time. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { defaultSize, type Shape, type Size, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import type {  TimeRange  } from '../calendar/dates.js';
	import Segments from '../date-field/internal/Segments.svelte';
	import type {  HourCycle, TimeGranularity  } from '../date-field/segments.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: TimeRange;
		onValueChange?: (value: TimeRange) => void;
		min?: string;
		max?: string;
		locale?: string;
		granularity?: TimeGranularity;
		hourCycle?: HourCycle;
		placeholder?: string;
		size?: Size;
		textSize?: TextSize;
		shape?: Shape;
		variant?: Variant;
		childTextColor?: TextColor;
		invalid?: boolean;
		readonly?: boolean;
		disabled?: boolean;
		name?: string;
	}

	let {
		value = $bindable({ start: null, end: null }),
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
		variant,
		childTextColor = 'text-muted',
		invalid,
		readonly = false,
		name,
		disabled = false,
		id,
		class: className,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);
	const resolvedVariant = $derived<Variant>(variant ?? fieldCtx?.variant ?? 'outline');
	const frame = $derived([
		...frameClasses({
			variant: resolvedVariant,
			size: resolvedSize,
			textSize,
			shape: resolvedShape,
			invalid: resolvedInvalid,
			disabled: Boolean(disabled)
		}),
		'font-sans tabular-nums',
		className
	]);

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
	class={frame}
	aria-disabled={disabled || undefined}
	{...rest}
>
	<Segments
		kind="time"
		value={range.start}
		onValueChange={setStart}
		{min}
		{max}
		{locale}
		timeGranularity={granularity}
		{hourCycle}
		{placeholder}
		disabled={Boolean(disabled)}
		{readonly}
		invalid={resolvedInvalid}
		label="Start"
	/>
	<span class={[childTextColor]} aria-hidden="true">–</span>
	<Segments
		kind="time"
		value={range.end}
		onValueChange={setEnd}
		{min}
		{max}
		{locale}
		timeGranularity={granularity}
		{hourCycle}
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
