/** Civil dates as year / month / day integers. No timezone-sensitive Date arithmetic. */

export interface Ymd {
	/** Full year, e.g. 2026. */
	y: number;
	/** Month, 1–12. */
	m: number;
	/** Day of the month, 1–31. */
	d: number;
}

/** An inclusive range of ISO dates, used by the calendar in `range` mode. */
export interface DateRange {
	start: string | null;
	end: string | null;
}

export type CalendarValue = string | null | string[] | DateRange;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Sakamoto offsets — weekday of the first of each month in a non-leap year, Monday-adjusted in `weekday`. */
const SAKAMOTO = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4] as const;

export function isLeap(y: number): boolean {
	return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
	if (m === 2) return isLeap(y) ? 29 : 28;
	return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] ?? 0;
}

export function isValid(date: Ymd): boolean {
	return (
		Number.isInteger(date.y) &&
		date.y >= 1 &&
		date.m >= 1 &&
		date.m <= 12 &&
		date.d >= 1 &&
		date.d <= daysInMonth(date.y, date.m)
	);
}

/** Parse an ISO `YYYY-MM-DD` string into a civil date, or `null` if it is not a real day. */
export function parseIso(iso: string): Ymd | null {
	const match = ISO.exec(iso);
	if (!match) return null;
	const date = { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
	return isValid(date) ? date : null;
}

/** Format a civil date as `YYYY-MM-DD`. */
export function toIso(date: Ymd): string {
	return `${String(date.y).padStart(4, '0')}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
}

/** Day of week: 0 = Sunday, 6 = Saturday. Pure integer math (Sakamoto). */
export function weekday(date: Ymd): number {
	const y = date.y - (date.m < 3 ? 1 : 0);
	return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + SAKAMOTO[date.m - 1] + date.d) % 7;
}

export function compare(a: Ymd, b: Ymd): number {
	return a.y - b.y || a.m - b.m || a.d - b.d;
}

export function equal(a: Ymd, b: Ymd): boolean {
	return a.y === b.y && a.m === b.m && a.d === b.d;
}

export function addDays(date: Ymd, n: number): Ymd {
	let { y, m, d } = date;
	d += n;
	while (d > daysInMonth(y, m)) {
		d -= daysInMonth(y, m);
		m += 1;
		if (m > 12) {
			m = 1;
			y += 1;
		}
	}
	while (d < 1) {
		m -= 1;
		if (m < 1) {
			m = 12;
			y -= 1;
		}
		d += daysInMonth(y, m);
	}
	return { y, m, d };
}

export function addMonths(date: Ymd, n: number): Ymd {
	let y = date.y;
	let m = date.m + n;
	while (m > 12) {
		m -= 12;
		y += 1;
	}
	while (m < 1) {
		m += 12;
		y -= 1;
	}
	return { y, m, d: Math.min(date.d, daysInMonth(y, m)) };
}

export function addYears(date: Ymd, n: number): Ymd {
	const y = date.y + n;
	return { y, m: date.m, d: Math.min(date.d, daysInMonth(y, date.m)) };
}

export function startOfMonth(date: Ymd): Ymd {
	return { y: date.y, m: date.m, d: 1 };
}

/** Today's civil date in the runtime's local zone — the one calendar users mean by "today". */
export function today(): Ymd {
	const now = new Date();
	return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export interface CalendarCell extends Ymd {
	iso: string;
	/** The cell belongs to the previous or next month, filling out the week. */
	outside: boolean;
}

/** Six weeks of cells for a month view, always 42 long so the grid does not jump. */
export function monthCells(view: Ymd, weekStartsOn: number): CalendarCell[] {
	const first = startOfMonth(view);
	const lead = (weekday(first) - weekStartsOn + 7) % 7;
	const start = addDays(first, -lead);
	const cells: CalendarCell[] = [];
	for (let i = 0; i < 42; i++) {
		const date = addDays(start, i);
		cells.push({ ...date, iso: toIso(date), outside: date.m !== view.m });
	}
	return cells;
}

/** Short weekday labels for a week that starts on `weekStartsOn`, in `locale`. */
export function weekdayLabels(locale: string | undefined, weekStartsOn: number): string[] {
	const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
	// 2021-08-01 was a Sunday, in UTC.
	return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2021, 7, 1 + ((weekStartsOn + i) % 7)))));
}

/** "November 2026" (or the equivalent in `locale`). */
export function monthTitle(view: Ymd, locale?: string): string {
	return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
		new Date(Date.UTC(view.y, view.m - 1, 1))
	);
}

export type DateFormat = 'short' | 'medium' | 'long';

const FORMAT: Record<DateFormat, Intl.DateTimeFormatOptions> = {
	short: { year: 'numeric', month: 'numeric', day: 'numeric' },
	medium: { year: 'numeric', month: 'short', day: 'numeric' },
	long: { year: 'numeric', month: 'long', day: 'numeric' }
};

/** Format an ISO date as a local civil date in `locale`. */
export function formatIso(iso: string, locale?: string, format: DateFormat = 'medium'): string {
	const date = parseIso(iso);
	if (!date) return iso;
	return new Intl.DateTimeFormat(locale, FORMAT[format]).format(new Date(date.y, date.m - 1, date.d));
}

function localeOrder(locale?: string): Array<'y' | 'm' | 'd'> {
	const parts = new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		timeZone: 'UTC'
	}).formatToParts(new Date(Date.UTC(2024, 10, 25)));
	const order: Array<'y' | 'm' | 'd'> = [];
	for (const part of parts) {
		if (part.type === 'year') order.push('y');
		else if (part.type === 'month') order.push('m');
		else if (part.type === 'day') order.push('d');
	}
	return order.length === 3 ? order : ['y', 'm', 'd'];
}

function monthLookup(locale?: string): { name: string; m: number }[] {
	const out: { name: string; m: number }[] = [];
	for (let m = 1; m <= 12; m++) {
		const date = new Date(Date.UTC(2021, m - 1, 15));
		for (const month of ['long', 'short'] as const) {
			const name = new Intl.DateTimeFormat(locale, { month, timeZone: 'UTC' }).format(date).toLowerCase();
			out.push({ name, m });
		}
	}
	return out.sort((a, b) => b.name.length - a.name.length);
}

function yearOf(n: number): number {
	if (n >= 100) return n;
	return n < 70 ? 2000 + n : 1900 + n;
}

/** Parse a typed date: ISO, locale-ordered numerics, or a month name plus day and year. */
export function parseInput(text: string, locale?: string): Ymd | null {
	const trimmed = text.trim();
	if (!trimmed) return null;
	const iso = parseIso(trimmed);
	if (iso) return iso;

	const lower = trimmed.toLowerCase();
	const names = monthLookup(locale);
	const named = names.find((n) => lower.includes(n.name));
	const numbers = (trimmed.match(/\d+/g) ?? []).map(Number);
	if (named && numbers.length >= 1) {
		const day = numbers.find((n) => n >= 1 && n <= 31) ?? numbers[0];
		const yearNum = numbers.find((n) => n !== day && (n >= 70 || n >= 100)) ?? numbers.find((n) => n !== day);
		if (day && yearNum !== undefined) {
			const date = { y: yearOf(yearNum), m: named.m, d: day };
			if (isValid(date)) return date;
		}
	}
	if (numbers.length === 3) {
		const order = localeOrder(locale);
		const slot: Record<'y' | 'm' | 'd', number> = { y: 0, m: 0, d: 0 };
		// If one number is > 12 and another is > 31, the large ones identify themselves.
		const parts = [...numbers];
		for (let i = 0; i < 3; i++) slot[order[i]] = parts[i];
		if (slot.y < 100 && slot.m > 31) {
			// unlikely; fall through
		}
		const date = { y: yearOf(slot.y), m: slot.m, d: slot.d };
		if (isValid(date)) return date;
		// Swap m/d once if the locale guess produced an invalid date (e.g. 13/2/2026 vs 2/13/2026).
		const swapped = { y: yearOf(slot.y), m: slot.d, d: slot.m };
		if (isValid(swapped)) return swapped;
	}
	return null;
}

export function isRangeValue(value: CalendarValue): value is DateRange {
	return typeof value === 'object' && value !== null && !Array.isArray(value) && 'start' in value && 'end' in value;
}

/** Whether `iso` lies in the inclusive range [start, end], both ISO or null. */
export function inRange(iso: string, start: string | null, end: string | null): boolean {
	if (!start || !end) return false;
	return start <= iso && iso <= end;
}

/** Sort two ISO dates so `start` ≤ `end`. */
export function orderedRange(a: string, b: string): DateRange {
	return a <= b ? { start: a, end: b } : { start: b, end: a };
}


/** Civil time as hour / minute / second integers, 24-hour, no timezone. */
export interface Hms {
	/** Hour, 0–23. */
	h: number;
	/** Minute, 0–59. */
	m: number;
	/** Second, 0–59. */
	s: number;
}

/** An inclusive range of ISO times, used by the time range field. */
export interface TimeRange {
	start: string | null;
	end: string | null;
}

const TIME_ISO = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function isValidTime(time: Hms): boolean {
	return (
		Number.isInteger(time.h) &&
		Number.isInteger(time.m) &&
		Number.isInteger(time.s) &&
		time.h >= 0 &&
		time.h <= 23 &&
		time.m >= 0 &&
		time.m <= 59 &&
		time.s >= 0 &&
		time.s <= 59
	);
}

/** Parse an ISO `HH:mm` or `HH:mm:ss` string into a civil time, or `null` if it is not a real time. */
export function parseTimeIso(iso: string): Hms | null {
	const match = TIME_ISO.exec(iso);
	if (!match) return null;
	const time = { h: Number(match[1]), m: Number(match[2]), s: match[3] != null ? Number(match[3]) : 0 };
	return isValidTime(time) ? time : null;
}

export type TimeGranularity = 'hour' | 'minute' | 'second';

/** Format a civil time as `HH:00`, `HH:mm`, or `HH:mm:ss` according to `granularity`. */
export function toTimeIso(time: Hms, granularity: TimeGranularity = 'minute'): string {
	const hh = String(time.h).padStart(2, '0');
	const mm = String(granularity === 'hour' ? 0 : time.m).padStart(2, '0');
	if (granularity === 'second') return `${hh}:${mm}:${String(time.s).padStart(2, '0')}`;
	return `${hh}:${mm}`;
}

/** Compare two ISO times. Missing or invalid strings compare as 0 against each other. */
export function compareTime(a: string, b: string): number {
	const left = parseTimeIso(a);
	const right = parseTimeIso(b);
	if (!left || !right) return 0;
	return left.h - right.h || left.m - right.m || left.s - right.s;
}
