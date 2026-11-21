<!-- @component A field that opens a two-month range calendar, with hover preview and optional presets. -->

<script lang="ts">
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCalendar, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/helpers.js';
	import { defaultSize, type ChildTextSize, type Pad, type Shape, type Size, type Surface, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import Calendar from '../calendar/Calendar.svelte';
	import { formatIso, type DateFormat, type DateRange } from '../calendar/dates.js';

	interface RangePreset {
		label: string;
		value: { start: string; end: string };
	}

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children' | 'type' | 'name' | 'form' | 'disabled'> {
		value?: DateRange;
		onValueChange?: (value: DateRange) => void;
		min?: string;
		max?: string;
		format?: DateFormat;
		clearable?: boolean;
		presets?: RangePreset[];
		locale?: string;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		surface?: Surface;
		invalid?: boolean;
		placeholder?: string;
		name?: string;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
			disabled?: boolean | null;
}

	let {
		value = $bindable({ start: null, end: null }),
		onValueChange,
		min,
		max,
		format = 'medium',
		clearable = false,
		presets,
		locale,
		weekStartsOn = 0,
		size,
		textSize,
		childTextSize = 'text-sm',
		childTextColor = 'text-muted',
		shape,
		variant,
		surface = 'glass',
		invalid,
		placeholder = 'Start date – End date',
		name,
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		id: idProp,
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
		'font-sans relative anchor xright',
		className
	]);

	const uid = $props.id();
	const triggerId = $derived(idProp ?? `${uid}-trigger`);
	const popId = `${uid}-pop`;

	let trigger = $state<HTMLButtonElement>();
	const range = $derived(value ?? { start: null, end: null });
	const hasValue = $derived(Boolean(range.start || range.end));

	const display = $derived.by(() => {
		if (range.start && range.end) return `${formatIso(range.start, locale, format)} – ${formatIso(range.end, locale, format)}`;
		if (range.start) return `${formatIso(range.start, locale, format)} – …`;
		return '';
	});

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
		if (next) queueMicrotask(() => trigger?.focus());
	}

	function commit(next: DateRange) {
		value = next;
		onValueChange?.(next);
	}

	function onCalendarChange(next: string | string[] | DateRange | null) {
		if (!next || typeof next === 'string' || Array.isArray(next)) return;
		commit(next);
		if (next.start && next.end) {
			setOpen(false);
			trigger?.focus();
		}
	}

	function applyPreset(preset: RangePreset) {
		commit({ start: preset.value.start, end: preset.value.end });
		setOpen(false);
		trigger?.focus();
	}

	function clear() {
		commit({ start: null, end: null });
		trigger?.focus();
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && !open) {
			event.preventDefault();
			setOpen(true);
		} else if (event.key === 'Escape' && open) {
			event.preventDefault();
			setOpen(false);
		}
	}

	$effect(() => {
		if (!open) return;
		const onDown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (trigger?.contains(target)) return;
			const pop = document.getElementById(popId);
			if (pop?.contains(target)) return;
			setOpen(false);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});
</script>

<div
	class={frame}
	aria-invalid={resolvedInvalid || undefined}
	{@attach anchor(uid)}
>
	<button
		bind:this={trigger}
		id={triggerId}
		type="button"
		class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, resolvedShape, clearable && hasValue ? 'pr-3xl' : 'pr-2xl']}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={popId}
		{disabled}
		onkeydown={onTriggerKeydown}
		onclick={() => setOpen(!open)}
		{...rest}
	>
		<span class={['truncate grow ta-l', !hasValue && childTextColor]}>{hasValue ? display : placeholder}</span>
	</button>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && hasValue && !disabled}
			<button type="button" class={['pointer-auto btn-icon ghost', resolvedSize, resolvedShape, childTextColor]} aria-label="Clear dates" onclick={clear}>
				<Icon icon={luX} />
			</button>
		{/if}
		<Icon icon={luCalendar} class={[childTextColor]} />
	</span>
</div>

<div
	id={popId}
	popover="manual"
	role="dialog"
	tabindex="-1"
	aria-label="Choose a date range"
	class={['floating at-bottom-start pop enter-down spring-snappy box gap-sm focus-none', surface, resolvedShape, 'pad-bs']}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, setOpen)}
>
	{#if presets?.length}
		<div class="row wrap gap-xs">
			{#each presets as preset (preset.label)}
				<button type="button" class={['button ghost', resolvedSize, childTextSize, resolvedShape]} onclick={() => applyPreset(preset)}>
					{preset.label}
				</button>
			{/each}
		</div>
	{/if}
	<Calendar
		mode="range"
		value={range}
		onValueChange={onCalendarChange}
		numberOfMonths={2}
		{min}
		{max}
		{locale}
		{weekStartsOn}
		disabled={Boolean(disabled)}
		label="Date range"
	/>
</div>

{#if name}
	<input type="hidden" name={`${name}-start`} value={range.start ?? ''} disabled={disabled || undefined} />
	<input type="hidden" name={`${name}-end`} value={range.end ?? ''} disabled={disabled || undefined} />
{/if}
