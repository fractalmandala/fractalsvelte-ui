<script lang="ts">
	import { vars } from '../../../../motion/index.js';
	import { parseInput, parseTimeIso } from '../../calendar/dates.js';
	import {
		clearSegment,
		dateFromIso,
		dateLayout,
		dateToIso,
		dayPeriodText,
		displayValue,
		editableTypes,
		emptyDate,
		emptyTime,
		finalizeYearOnLeave,
		pageStep,
		periodFromKey,
		placeholderDate,
		placeholderTime,
		resolveHourCycle,
		segmentLabel,
		segmentLimits,
		segmentWidth,
		setDateSegment,
		setTimeSegment,
		stepDate,
		stepTime,
		timeFromIso,
		timeLayout,
		timeToIso,
		typeDigit,
		type DateGranularity,
		type EditableType,
		type HourCycle,
		type PartialDate,
		type PartialTime,
		type TimeGranularity
	} from '../segments.js';


	function isDateType(type: EditableType): type is 'year' | 'month' | 'day' {
		return type === 'year' || type === 'month' || type === 'day';
	}

	function isTimeType(type: EditableType): type is 'hour' | 'minute' | 'second' | 'dayPeriod' {
		return type === 'hour' || type === 'minute' || type === 'second' || type === 'dayPeriod';
	}

	function isNumericTime(type: EditableType): type is 'hour' | 'minute' | 'second' {
		return type === 'hour' || type === 'minute' || type === 'second';
	}

	interface Props {

		/** `'date'` renders year/month/day segments; `'time'` renders hour/minute/second and optional AM/PM. */
		kind: 'date' | 'time';
		/** The ISO value, or `null` while any required segment is empty. */
		value?: string | null;
		/** Called whenever a complete ISO value is committed or the field becomes incomplete. */
		onValueChange?: (value: string | null) => void;
		/** The earliest selectable ISO date or time. */
		min?: string;
		/** The latest selectable ISO date or time. */
		max?: string;
		/** BCP 47 locale for segment order, literals and AM/PM. */
		locale?: string;
		/** How complete a date must be to commit. */
		dateGranularity?: DateGranularity;
		/** How complete a time must be to commit. */
		timeGranularity?: TimeGranularity;
		/** 12-hour (with AM/PM) or 24-hour clock. Defaults from the locale. */
		hourCycle?: HourCycle;
		/** ISO date or time used when a person first increments an empty segment. */
		placeholder?: string;
		/** When true, segments cannot be focused. */
		disabled?: boolean;
		/** When true, segments are focusable but not editable. */
		readonly?: boolean;
		/** Marks every spinbutton as invalid. */
		invalid?: boolean;
		/** Accessible name for this group of segments, used when the parent is a range side. */
		label?: string;
	}

	let {
		kind,
		value = $bindable(null),
		onValueChange,
		min,
		max,
		locale,
		dateGranularity = 'day',
		timeGranularity = 'minute',
		hourCycle: hourCycleProp,
		placeholder,
		disabled = false,
		readonly = false,
		invalid = false,
		label
	}: Props = $props();

	const cycle = $derived(kind === 'time' ? resolveHourCycle(locale, hourCycleProp) : 24);
	const parts = $derived(kind === 'date' ? dateLayout(locale, dateGranularity) : timeLayout(locale, timeGranularity, cycle));
	const types = $derived(editableTypes(parts));
	const indexes = $derived.by(() => {
		const map: number[] = [];
		let i = 0;
		for (const part of parts) map.push(part.type === 'literal' ? -1 : i++);
		return map;
	});
	const dateBaseline = $derived(placeholderDate(kind === 'date' ? placeholder : undefined));
	const timeBaseline = $derived(placeholderTime(kind === 'time' ? placeholder : undefined));

	let date = $state<PartialDate>(emptyDate());
	let time = $state<PartialTime>(emptyTime());
	let lastCommitted = $state<string | null>(null);
	let active = $state(0);
	let buffer = $state('');
	let nodes: HTMLElement[] = [];

	$effect(() => {
		const next = value ?? null;
		if (next === lastCommitted) return;
		lastCommitted = next;
		if (kind === 'date') date = dateFromIso(next);
		else time = timeFromIso(next);
	});

	function register(index: number) {
		return (node: HTMLElement) => {
			nodes[index] = node;
			return () => {
				if (nodes[index] === node) delete nodes[index];
			};
		};
	}

	function commitDate(next: PartialDate) {
		date = next;
		const iso = dateToIso(next, dateGranularity);
		lastCommitted = iso;
		if (iso !== value) {
			value = iso;
			onValueChange?.(iso);
		}
	}

	function commitTime(next: PartialTime) {
		time = next;
		const iso = timeToIso(next, timeGranularity);
		lastCommitted = iso;
		if (iso !== value) {
			value = iso;
			onValueChange?.(iso);
		}
	}

	function focusAt(index: number) {
		const next = Math.max(0, Math.min(index, types.length - 1));
		active = next;
		buffer = '';
		nodes[next]?.focus();
	}

	function leaveSegment(type: EditableType) {
		if (kind === 'date' && type === 'year') {
			const next = finalizeYearOnLeave(date, buffer, type);
			if (next.y !== date.y) commitDate(next);
		}
		buffer = '';
	}

	function chopBuffer(type: EditableType) {
		const nextBuffer = buffer.slice(0, -1);
		if (!nextBuffer) {
			if (kind === 'date') commitDate(clearSegment('date', date, type, cycle, dateGranularity));
			else commitTime(clearSegment('time', time, type, cycle, timeGranularity));
			buffer = '';
			return;
		}
		const n = Number(nextBuffer);
		const limits = segmentLimits(type, date, cycle);
		if (kind === 'date' && (type === 'year' || type === 'month' || type === 'day')) {
			commitDate(
				n >= limits.min && n <= limits.max
					? setDateSegment(date, type, n, dateGranularity, min, max)
					: clearSegment('date', date, type, cycle, dateGranularity)
			);
		} else if (kind === 'time' && isNumericTime(type)) {
			commitTime(
				n >= limits.min && n <= limits.max
					? setTimeSegment(time, type, n, cycle, timeGranularity, min, max)
					: clearSegment('time', time, type, cycle, timeGranularity)
			);
		}
		buffer = nextBuffer;
	}

	function onKey(index: number, type: EditableType, event: KeyboardEvent) {
		if (disabled) return;
		const key = event.key;
		if (key === 'ArrowLeft') {
			event.preventDefault();
			leaveSegment(type);
			focusAt(index - 1);
			return;
		}
		if (key === 'ArrowRight') {
			event.preventDefault();
			leaveSegment(type);
			focusAt(index + 1);
			return;
		}
		if (key === 'Home') {
			event.preventDefault();
			leaveSegment(type);
			focusAt(0);
			return;
		}
		if (key === 'End') {
			event.preventDefault();
			leaveSegment(type);
			focusAt(types.length - 1);
			return;
		}
		if (readonly) return;
		if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'PageUp' || key === 'PageDown') {
			event.preventDefault();
			const sign = key === 'ArrowDown' || key === 'PageDown' ? -1 : 1;
			const delta = sign * (key === 'PageUp' || key === 'PageDown' ? pageStep(type) : 1);
			if (kind === 'date' && isDateType(type)) {
				commitDate(stepDate(date, type, delta, dateGranularity, dateBaseline, min, max));
			} else if (kind === 'time' && isTimeType(type)) {
				commitTime(stepTime(time, type, delta, timeGranularity, timeBaseline, min, max));
			}
			buffer = '';
			return;
		}
		if (key === 'Backspace' && buffer.length > 0) {
			event.preventDefault();
			chopBuffer(type);
			return;
		}
		if (key === 'Backspace' || key === 'Delete') {
			event.preventDefault();
			const view = displayValue(type, date, time, locale, cycle);
			if (key === 'Backspace' && view.empty && index > 0) {
				const prev = types[index - 1];
				if (kind === 'date') commitDate(clearSegment('date', date, prev, cycle, dateGranularity));
				else commitTime(clearSegment('time', time, prev, cycle, timeGranularity));
				focusAt(index - 1);
				return;
			}
			if (kind === 'date') commitDate(clearSegment('date', date, type, cycle, dateGranularity));
			else commitTime(clearSegment('time', time, type, cycle, timeGranularity));
			buffer = '';
			return;
		}
		if (type === 'dayPeriod') {
			const period = periodFromKey(key, locale);
			if (period == null) return;
			event.preventDefault();
			commitTime(setTimeSegment(time, 'dayPeriod', period, cycle, timeGranularity, min, max));
			return;
		}
		if (/^\d$/.test(key)) {
			event.preventDefault();
			if (kind === 'date' && (type === 'year' || type === 'month' || type === 'day')) {
				const result = typeDigit('date', date, type, buffer, key, cycle, dateGranularity, min, max);
				commitDate(result.value);
				buffer = result.buffer;
				if (result.advance) {
					leaveSegment(type);
					focusAt(index + 1);
				}
			} else if (kind === 'time' && isNumericTime(type)) {
				const result = typeDigit('time', time, type, buffer, key, cycle, timeGranularity, min, max);
				commitTime(result.value);
				buffer = result.buffer;
				if (result.advance) {
					leaveSegment(type);
					focusAt(index + 1);
				}
			}
		}
	}

	function onPaste(event: ClipboardEvent) {
		if (disabled || readonly) return;
		const text = event.clipboardData?.getData('text') ?? '';
		if (kind === 'date') {
			const parsed = parseInput(text, locale);
			if (!parsed) return;
			event.preventDefault();
			commitDate({ y: parsed.y, m: parsed.m, d: parsed.d });
			return;
		}
		const parsed = parseTimeIso(text.trim());
		if (!parsed) return;
		event.preventDefault();
		commitTime({ h: parsed.h, m: parsed.m, s: parsed.s });
	}

	function shown(type: EditableType) {
		const view = displayValue(type, date, time, locale, cycle);
		if (types[active] === type && buffer.length > 0) {
			const width = segmentWidth(type);
			return { ...view, empty: false, text: buffer.padStart(Math.min(width, buffer.length), '0') };
		}
		return view;
	}
</script>

<span class="row ycenter" role={label ? 'group' : undefined} aria-label={label} onpaste={onPaste}>
	{#each parts as part, partIndex (partIndex)}
		{#if part.type === 'literal'}
			<span class="text-muted" aria-hidden="true">{part.text}</span>
		{:else}
			{@const type = part.type as EditableType}
			{@const index = indexes[partIndex]}
			{@const view = shown(type)}
			{@const limits = segmentLimits(type, date, cycle)}
			<span
				{@attach register(index)}
				role="spinbutton"
				class={['segment', view.empty && 'empty']}
				tabindex={disabled ? -1 : index === active ? 0 : -1}
				aria-label={segmentLabel(type)}
				aria-valuemin={limits.min}
				aria-valuemax={limits.max}
				aria-valuenow={view.number}
				aria-valuetext={type === 'dayPeriod' && view.empty ? dayPeriodText(locale, 0) : view.text}
				aria-disabled={disabled || undefined}
				aria-readonly={readonly || undefined}
				aria-invalid={invalid || undefined}
				{@attach vars({ ch: segmentWidth(type) })}
				onfocus={() => {
					active = index;
					buffer = '';
				}}
				onkeydown={(event) => onKey(index, type, event)}
				onclick={() => focusAt(index)}
				onpaste={onPaste}
			>
				{view.text}
			</span>
		{/if}
	{/each}
</span>
