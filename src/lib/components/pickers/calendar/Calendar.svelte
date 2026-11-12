<!-- @component A month grid for picking a day, a range or several days, with locale-aware labels and full keyboard navigation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronLeft, luChevronRight } from '@fractaldesign/icons/lucide';
	import { animate, setMotion } from '../../../motion/index.js';
	import {
		addDays,
		addMonths,
		addYears,
		formatIso,
		inRange,
		isRangeValue,
		monthCells,
		monthTitle,
		orderedRange,
		parseIso,
		startOfMonth,
		today,
		toIso,
		weekday,
		weekdayLabels,
		type CalendarValue,
		type DateRange,
		type Ymd
	} from './dates.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The chosen date (`YYYY-MM-DD`), an array of dates, or a `{ start, end }` range — depending on `mode`. Bindable. */
		value?: CalendarValue;
		/** Called whenever the person changes the selection. */
		onValueChange?: (value: CalendarValue) => void;
		/** `single` picks one day, `range` a start and end, `multiple` any number of days. */
		mode?: 'single' | 'range' | 'multiple';
		/** The earliest selectable ISO date. */
		min?: string;
		/** The latest selectable ISO date. */
		max?: string;
		/** Returns true when a date cannot be selected. Combined with `min` and `max`. */
		isDateDisabled?: (iso: string) => boolean;
		/** Day the week starts on, 0 = Sunday through 6 = Saturday. */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		/** BCP 47 locale for month names and weekday labels. Defaults to the runtime locale. */
		locale?: string;
		/** How many months to show side by side. */
		numberOfMonths?: number;
		/** Blocks pointer and keyboard input. */
		disabled?: boolean;
		/** Accessible name of the calendar. */
		label?: string;
	}

	let {
		value = $bindable(null),
		onValueChange,
		mode = 'single',
		min,
		max,
		isDateDisabled,
		weekStartsOn = 0,
		locale,
		numberOfMonths = 1,
		disabled = false,
		label,
		class: klass,
		...rest
	}: Props = $props();

	const todayDate = today();
	const todayIso = toIso(todayDate);

	function initialView(): Ymd {
		if (typeof value === 'string') return startOfMonth(parseIso(value) ?? todayDate);
		if (Array.isArray(value) && value[0]) return startOfMonth(parseIso(value[0]) ?? todayDate);
		if (isRangeValue(value) && value.start) return startOfMonth(parseIso(value.start) ?? todayDate);
		return startOfMonth(todayDate);
	}

	let view = $state<Ymd>(initialView());
	let focusIso = $state<string>(
		typeof value === 'string' && value ? value : todayIso
	);
	let hoverIso = $state<string | null>(null);
	let grid = $state<HTMLElement>();
	let direction = 1;


	$effect(() => {
		const iso = focusIso;
		const node = grid;
		if (!node || typeof document === 'undefined' || !node.contains(document.activeElement)) return;
		const frame = requestAnimationFrame(() => {
			node.querySelector<HTMLElement>(`[data-iso="${iso}"]`)?.focus();
		});
		return () => cancelAnimationFrame(frame);
	});

	const labels = $derived(weekdayLabels(locale, weekStartsOn));
	const months = $derived(Array.from({ length: Math.max(1, numberOfMonths) }, (_, i) => addMonths(view, i)));
	const range = $derived(isRangeValue(value) ? value : { start: null, end: null });
	const selectedSet = $derived(new Set(Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : []));

	const preview = $derived.by((): DateRange | null => {
		if (mode !== 'range' || !range.start || range.end || !hoverIso) return null;
		return orderedRange(range.start, hoverIso);
	});

	function commit(next: CalendarValue) {
		value = next;
		onValueChange?.(next);
	}

	function blocked(iso: string): boolean {
		if (min && iso < min) return true;
		if (max && iso > max) return true;
		return Boolean(isDateDisabled?.(iso));
	}

	function isSelected(iso: string): boolean {
		if (mode === 'range') return iso === range.start || iso === range.end;
		if (mode === 'multiple') return selectedSet.has(iso);
		return value === iso;
	}

	function isStart(iso: string): boolean {
		if (mode !== 'range') return false;
		const span = preview ?? range;
		return span.start === iso;
	}

	function isEnd(iso: string): boolean {
		if (mode !== 'range') return false;
		const span = preview ?? range;
		return span.end === iso;
	}

	function isInRange(iso: string): boolean {
		if (mode !== 'range') return false;
		const span = preview ?? range;
		return inRange(iso, span.start, span.end);
	}

	function shiftView(next: Ymd, dir: number) {
		direction = dir;
		view = startOfMonth(next);
		const node = grid;
		if (!node) return;
		setMotion(node, { x: dir * 24 });
		animate(node, { x: 0 }, { spring: 'snappy' });
	}

	function prev() {
		if (disabled) return;
		shiftView(addMonths(view, -1), -1);
	}

	function next() {
		if (disabled) return;
		shiftView(addMonths(view, 1), 1);
	}

	function reveal(iso: string, dir = 1) {
		const date = parseIso(iso);
		if (!date) return;
		const first = view;
		const last = addMonths(view, Math.max(1, numberOfMonths) - 1);
		if (date.y < first.y || (date.y === first.y && date.m < first.m)) shiftView(startOfMonth(date), -1);
		else if (date.y > last.y || (date.y === last.y && date.m > last.m)) shiftView(startOfMonth(addMonths(date, 1 - Math.max(1, numberOfMonths))), 1);
		else if (dir !== 0) {
			/* already visible */
		}
	}

	function select(iso: string) {
		if (disabled || blocked(iso)) return;
		focusIso = iso;
		if (mode === 'multiple') {
			const next = selectedSet.has(iso) ? valueArr().filter((d) => d !== iso) : [...valueArr(), iso];
			commit(next);
			return;
		}
		if (mode === 'range') {
			if (!range.start || range.end) {
				commit({ start: iso, end: null });
				hoverIso = null;
			} else {
				commit(orderedRange(range.start, iso));
				hoverIso = null;
			}
			return;
		}
		commit(iso);
	}

	function valueArr(): string[] {
		return Array.isArray(value) ? value : [];
	}

	function moveFocus(iso: string) {
		focusIso = iso;
		reveal(iso);
	}

	function weekdayOffset(date: Ymd): number {
		return (weekday(date) - weekStartsOn + 7) % 7;
	}

	function onGridKeydown(event: KeyboardEvent) {

		if (disabled) return;
		const date = parseIso(focusIso) ?? todayDate;
		let next: Ymd | undefined;
		const shift = event.shiftKey;
		switch (event.key) {
			case 'ArrowLeft':
				next = addDays(date, -1);
				break;
			case 'ArrowRight':
				next = addDays(date, 1);
				break;
			case 'ArrowUp':
				next = addDays(date, -7);
				break;
			case 'ArrowDown':
				next = addDays(date, 7);
				break;
			case 'Home':
				next = addDays(date, -weekdayOffset(date));
				break;
			case 'End':
				next = addDays(date, 6 - weekdayOffset(date));
				break;
			case 'PageUp':
				next = shift ? addYears(date, -1) : addMonths(date, -1);
				break;
			case 'PageDown':
				next = shift ? addYears(date, 1) : addMonths(date, 1);
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				select(focusIso);
				return;
			default:
				return;
		}
		event.preventDefault();
		if (next) moveFocus(toIso(next));
	}

	function onCellKeydown(event: KeyboardEvent, iso: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			select(iso);
		}
	}

	const title = $derived(
		months.length === 1
			? monthTitle(months[0], locale)
			: `${monthTitle(months[0], locale)} – ${monthTitle(months[months.length - 1], locale)}`
	);

	function cellLabel(iso: string): string {
		return formatIso(iso, locale, 'long');
	}
</script>

<div
	class={['box gap-sm select-none', disabled && 'disabled', klass]}
	{...rest}
>
	<div class="row ycenter xbetween gap-sm">
		<button
			type="button"
			class="button btn-icon ghost round h-lg"
			aria-label="Previous month"
			disabled={disabled}
			onclick={prev}
		>
			<Icon icon={luChevronLeft} />
		</button>
		<div class="text-md weight-500 text-primary grow ta-c">{title}</div>
		<button
			type="button"
			class="button btn-icon ghost round h-lg"
			aria-label="Next month"
			disabled={disabled}
			onclick={next}
		>
			<Icon icon={luChevronRight} />
		</button>
	</div>

	<div bind:this={grid} class={['row ytop gap-lg motion', numberOfMonths > 1 && 'wrap']}>
		{#each months as month (toIso(month))}
			<div
				role="grid"
				tabindex="-1"
				aria-label={label ? `${label}, ${monthTitle(month, locale)}` : monthTitle(month, locale)}
				aria-disabled={disabled || undefined}
				class="box gap-xs grow"
				onkeydown={onGridKeydown}
			>
				<div role="row" class="grid-7">
					{#each labels as name (name)}
						<div role="columnheader" class="ta-c text-xs text-muted weight-500 py-xs">{name}</div>
					{/each}
				</div>
				{#each [0, 1, 2, 3, 4, 5] as week (week)}
					<div role="row" class="grid-7">
						{#each monthCells(month, weekStartsOn).slice(week * 7, week * 7 + 7) as cell (cell.iso)}
							{@const on = isSelected(cell.iso)}
							{@const start = isStart(cell.iso)}
							{@const end = isEnd(cell.iso)}
							{@const mid = isInRange(cell.iso)}
							{@const off = blocked(cell.iso)}
							<button
								type="button"
								role="gridcell"
								class={[
									'cell',
									cell.outside && 'outside',
									cell.iso === todayIso && 'today',
									on && 'selected',
									start && 'range-start',
									end && 'range-end',
									mid && 'in-range',
									preview && mid && 'preview'
								]}
								data-iso={cell.iso}
								tabindex={cell.iso === focusIso ? 0 : -1}
								aria-selected={on}
								aria-disabled={off || undefined}
								aria-current={cell.iso === todayIso ? 'date' : undefined}
								aria-label={cellLabel(cell.iso)}
								disabled={disabled || undefined}
								onpointerenter={() => mode === 'range' && range.start && !range.end && (hoverIso = cell.iso)}
								onpointerleave={() => hoverIso === cell.iso && (hoverIso = null)}
								onclick={() => select(cell.iso)}
								onkeydown={(event) => onCellKeydown(event, cell.iso)}
							>
								{cell.d}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
