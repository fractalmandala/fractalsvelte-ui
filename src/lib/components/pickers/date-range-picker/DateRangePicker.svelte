<!-- @component A field that opens a two-month range calendar, with hover preview and optional presets. -->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCalendar, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { defaultSize, controlSize, textClass, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import Calendar from '../calendar/Calendar.svelte';
	import { formatIso, type DateFormat, type DateRange } from '../calendar/dates.js';

	interface RangePreset {
		/** The visible name of the preset, e.g. "Last 7 days". */
		label: string;
		/** The inclusive start and end ISO dates the preset writes to `value`. */
		value: { start: string; end: string };
	}

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children' | 'type' | 'name' | 'form'> {
		/** The inclusive start and end dates as ISO `YYYY-MM-DD`, either of which may be `null`. Bindable. */
		value?: DateRange;
		/** Called whenever the person changes the range. */
		onValueChange?: (value: DateRange) => void;
		/** The earliest selectable ISO date. */
		min?: string;
		/** The latest selectable ISO date. */
		max?: string;
		/** How each date is shown in the field. */
		format?: DateFormat;
		/** Shows a button that clears the range. */
		clearable?: boolean;
		/** Quick-pick ranges listed above the calendar. */
		presets?: RangePreset[];
		/** BCP 47 locale for formatting and calendar labels. */
		locale?: string;
		/** Day the week starts on, 0 = Sunday through 6 = Saturday. */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the field. @default 'modern' */
		shape?: Shape;
		/** Marks the field as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** The text shown while no range is chosen. */
		placeholder?: string;
		/** The name of the hidden inputs (`-start` and `-end` suffixes) that carry the range in a form. */
		name?: string;
		/** Whether the calendar is showing. Bindable. */
		open?: boolean;
		/** Called when the calendar opens or closes. */
		onOpenChange?: (open: boolean) => void;
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
		shape,
		invalid,
		placeholder = 'Start date – End date',
		name,
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		id: idProp,
		class: klass,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);

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
	class={[
		'field anchor relative row ycenter xright bg-input border',
		controlSize(resolvedSize, textSize),
		resolvedShape,
		resolvedInvalid && 'is-invalid',
		disabled && 'disabled',
		klass
	]}
	aria-invalid={resolvedInvalid || undefined}
	{@attach anchor(uid)}
>
	<button
		bind:this={trigger}
		id={triggerId}
		type="button"
		class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans text-primary', textClass[textSize ?? resolvedSize], resolvedShape, clearable && hasValue ? 'pr-3xl' : 'pr-2xl']}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={popId}
		{disabled}
		onkeydown={onTriggerKeydown}
		onclick={() => setOpen(!open)}
		{...rest}
	>
		<span class={['truncate grow ta-l', !hasValue && 'text-muted']}>{hasValue ? display : placeholder}</span>
	</button>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && hasValue && !disabled}
			<button type="button" class="pointer-auto btn-icon h-md ghost round text-muted" aria-label="Clear dates" onclick={clear}>
				<Icon icon={luX} />
			</button>
		{/if}
		<Icon icon={luCalendar} class="text-muted" />
	</span>
</div>

<div
	id={popId}
	popover="manual"
	role="dialog"
	tabindex="-1"
	aria-label="Choose a date range"
	class="floating at-bottom-start pop enter-down spring-snappy glass border rim shad-lg modern pad-bs box gap-sm focus-none"
	{@attach floating(uid)}
	{@attach popoverSync(() => open, setOpen)}
>
	{#if presets?.length}
		<div class="row wrap gap-xs">
			{#each presets as preset (preset.label)}
				<button type="button" class="button ghost h-bs text-sm modern" onclick={() => applyPreset(preset)}>
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
