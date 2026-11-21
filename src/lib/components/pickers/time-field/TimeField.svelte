<!-- @component A segmented time field whose hour, minute and optional second are edited with the keyboard. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { defaultSize, type Shape, type Size, type TextSize, type Variant } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import Segments from '../date-field/internal/Segments.svelte';
	import type {  HourCycle, TimeGranularity  } from '../date-field/segments.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: string | null;
		onValueChange?: (value: string | null) => void;
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
		invalid?: boolean;
		readonly?: boolean;
		disabled?: boolean;
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
		variant,
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
