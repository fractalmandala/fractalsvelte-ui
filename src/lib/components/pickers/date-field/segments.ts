/** Segmented date and time field helpers. Owned by date-field; imported by the range and time fields. */

import {
	addDays,
	addMonths,
	addYears,
	compare,
	daysInMonth,
	isValid,
	parseIso,
	parseTimeIso,
	toIso,
	toTimeIso,
	today,
	type Hms,
	type TimeGranularity,
	type Ymd
} from '../calendar/dates.js';

export type DateGranularity = 'day' | 'month' | 'year';
export type HourCycle = 12 | 24;
export type { TimeGranularity };

export type EditableType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'dayPeriod';
export type PartType = EditableType | 'literal';

export interface FieldPart {
	type: PartType;
	/** Literal text; unused for editable parts. */
	text: string;
}

/** A civil date that may still be missing segments. */
export interface PartialDate {
	y: number | null;
	m: number | null;
	d: number | null;
}

/** A civil time that may still be missing segments. Hours are always 0–23. */
export interface PartialTime {
	h: number | null;
	m: number | null;
	s: number | null;
}

export function emptyDate(): PartialDate {
	return { y: null, m: null, d: null };
}

export function emptyTime(): PartialTime {
	return { h: null, m: null, s: null };
}

export function midnight(): PartialTime {
	return { h: 0, m: 0, s: 0 };
}

export function dateFromIso(iso: string | null | undefined): PartialDate {
	if (!iso) return emptyDate();
	const parsed = parseIso(iso);
	return parsed ? { y: parsed.y, m: parsed.m, d: parsed.d } : emptyDate();
}

export function timeFromIso(iso: string | null | undefined): PartialTime {
	if (!iso) return emptyTime();
	const parsed = parseTimeIso(iso);
	return parsed ? { h: parsed.h, m: parsed.m, s: parsed.s } : emptyTime();
}

export function dateToIso(value: PartialDate, granularity: DateGranularity): string | null {
	if (value.y == null) return null;
	if (granularity === 'year') return toIso({ y: value.y, m: 1, d: 1 });
	if (value.m == null) return null;
	if (granularity === 'month') return toIso({ y: value.y, m: value.m, d: 1 });
	if (value.d == null) return null;
	const date = { y: value.y, m: value.m, d: value.d };
	return isValid(date) ? toIso(date) : null;
}

export function timeToIso(value: PartialTime, granularity: TimeGranularity): string | null {
	if (value.h == null) return null;
	if (granularity === 'hour') return toTimeIso({ h: value.h, m: 0, s: 0 }, 'hour');
	if (value.m == null) return null;
	if (granularity === 'minute') return toTimeIso({ h: value.h, m: value.m, s: 0 }, 'minute');
	if (value.s == null) return null;
	const time = { h: value.h, m: value.m, s: value.s };
	return toTimeIso(time, 'second');
}

export function resolveHourCycle(locale: string | undefined, hourCycle?: HourCycle): HourCycle {
	if (hourCycle === 12 || hourCycle === 24) return hourCycle;
	const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
	return cycle === 'h11' || cycle === 'h12' ? 12 : 24;
}

export function dateLayout(locale: string | undefined, granularity: DateGranularity): FieldPart[] {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', timeZone: 'UTC' };
	if (granularity !== 'year') options.month = '2-digit';
	if (granularity === 'day') options.day = '2-digit';
	return partsFrom(new Intl.DateTimeFormat(locale, options).formatToParts(new Date(Date.UTC(2024, 10, 25))));
}

export function timeLayout(
	locale: string | undefined,
	granularity: TimeGranularity,
	hourCycle: HourCycle
): FieldPart[] {
	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		hourCycle: hourCycle === 12 ? 'h12' : 'h23',
		timeZone: 'UTC'
	};
	if (granularity !== 'hour') options.minute = '2-digit';
	if (granularity === 'second') options.second = '2-digit';
	const parts = partsFrom(new Intl.DateTimeFormat(locale, options).formatToParts(new Date(Date.UTC(2024, 0, 1, 13, 30, 45))));
	if (hourCycle === 12 && !parts.some((part) => part.type === 'dayPeriod')) {
		parts.push({ type: 'literal', text: ' ' }, { type: 'dayPeriod', text: '' });
	}
	return parts;
}

function partsFrom(intl: Intl.DateTimeFormatPart[]): FieldPart[] {
	const out: FieldPart[] = [];
	for (const part of intl) {
		if (
			part.type === 'year' ||
			part.type === 'month' ||
			part.type === 'day' ||
			part.type === 'hour' ||
			part.type === 'minute' ||
			part.type === 'second' ||
			part.type === 'dayPeriod'
		) {
			out.push({ type: part.type, text: '' });
		} else if (part.type === 'literal') {
			out.push({ type: 'literal', text: part.value });
		}
	}
	return out;
}

export function editableTypes(parts: FieldPart[]): EditableType[] {
	return parts.filter((part): part is FieldPart & { type: EditableType } => part.type !== 'literal').map((part) => part.type);
}

export function segmentLabel(type: EditableType): string {
	switch (type) {
		case 'year':
			return 'Year';
		case 'month':
			return 'Month';
		case 'day':
			return 'Day';
		case 'hour':
			return 'Hour';
		case 'minute':
			return 'Minute';
		case 'second':
			return 'Second';
		case 'dayPeriod':
			return 'AM/PM';
	}
}

export function placeholderText(type: EditableType): string {
	switch (type) {
		case 'year':
			return 'yyyy';
		case 'month':
			return 'mm';
		case 'day':
			return 'dd';
		case 'hour':
		case 'minute':
		case 'second':
			return '––';
		case 'dayPeriod':
			return 'AM';
	}
}

export function segmentWidth(type: EditableType): number {
	return type === 'year' ? 4 : type === 'dayPeriod' ? 3 : 2;
}

/** Localized AM or PM (or the locale's equivalent) for a 24-hour hour. */
export function dayPeriodText(locale: string | undefined, hour: number | null): string {
	const sample = hour == null || hour < 12 ? 6 : 18;
	return (
		new Intl.DateTimeFormat(locale, { hour: 'numeric', hourCycle: 'h12', timeZone: 'UTC' })
			.formatToParts(new Date(Date.UTC(2024, 0, 1, sample)))
			.find((part) => part.type === 'dayPeriod')?.value ?? (sample < 12 ? 'AM' : 'PM')
	);
}

export function hour12(hour: number): number {
	const mod = hour % 12;
	return mod === 0 ? 12 : mod;
}

export function displayValue(
	type: EditableType,
	date: PartialDate,
	time: PartialTime,
	locale: string | undefined,
	hourCycle: HourCycle
): { empty: boolean; text: string; number: number | undefined } {
	switch (type) {
		case 'year':
			return date.y == null ? empty('year') : filled(date.y, String(date.y).padStart(4, '0'));
		case 'month':
			return date.m == null ? empty('month') : filled(date.m, String(date.m).padStart(2, '0'));
		case 'day':
			return date.d == null ? empty('day') : filled(date.d, String(date.d).padStart(2, '0'));
		case 'hour': {
			if (time.h == null) return empty('hour');
			const shown = hourCycle === 12 ? hour12(time.h) : time.h;
			return filled(shown, String(shown).padStart(2, '0'));
		}
		case 'minute':
			return time.m == null ? empty('minute') : filled(time.m, String(time.m).padStart(2, '0'));
		case 'second':
			return time.s == null ? empty('second') : filled(time.s, String(time.s).padStart(2, '0'));
		case 'dayPeriod':
			return time.h == null
				? { empty: true, text: dayPeriodText(locale, 0), number: 0 }
				: { empty: false, text: dayPeriodText(locale, time.h), number: time.h < 12 ? 0 : 1 };
	}
}

function empty(type: EditableType): { empty: boolean; text: string; number: undefined } {
	return { empty: true, text: placeholderText(type), number: undefined };
}

function filled(number: number, text: string): { empty: boolean; text: string; number: number } {
	return { empty: false, text, number };
}

export function segmentLimits(
	type: EditableType,
	date: PartialDate,
	hourCycle: HourCycle
): { min: number; max: number } {
	switch (type) {
		case 'year':
			return { min: 1, max: 9999 };
		case 'month':
			return { min: 1, max: 12 };
		case 'day':
			return { min: 1, max: date.y != null && date.m != null ? daysInMonth(date.y, date.m) : 31 };
		case 'hour':
			return hourCycle === 12 ? { min: 1, max: 12 } : { min: 0, max: 23 };
		case 'minute':
		case 'second':
			return { min: 0, max: 59 };
		case 'dayPeriod':
			return { min: 0, max: 1 };
	}
}

export function placeholderDate(iso: string | undefined): PartialDate {
	return iso ? dateFromIso(iso) : ymdToPartial(today());
}

export function placeholderTime(iso: string | undefined): PartialTime {
	return iso ? timeFromIso(iso) : midnight();
}

function ymdToPartial(date: Ymd): PartialDate {
	return { y: date.y, m: date.m, d: date.d };
}

function expandYear(n: number): number {
	if (n >= 100) return n;
	return n < 70 ? 2000 + n : 1900 + n;
}

function clampDateIso(date: Ymd, min?: string, max?: string): Ymd {
	const iso = toIso(date);
	if (min) {
		const lower = parseIso(min);
		if (lower && compare(date, lower) < 0) return lower;
	}
	if (max) {
		const upper = parseIso(max);
		if (upper && compare(date, upper) > 0) return upper;
	}
	void iso;
	return date;
}

function clampTimeValue(time: Hms, min?: string, max?: string): Hms {
	const iso = toTimeIso(time, 'second');
	if (min) {
		const lower = parseTimeIso(min);
		if (lower && toTimeIso(lower, 'second') > iso) return lower;
	}
	if (max) {
		const upper = parseTimeIso(max);
		if (upper && toTimeIso(upper, 'second') < iso) return upper;
	}
	return time;
}

function completeYmd(value: PartialDate, granularity: DateGranularity, fallback: PartialDate): Ymd | null {
	const y = value.y ?? fallback.y;
	const m = granularity === 'year' ? 1 : (value.m ?? fallback.m);
	const d = granularity !== 'day' ? 1 : (value.d ?? fallback.d);
	if (y == null || m == null || d == null) return null;
	const date = { y, m, d: Math.min(d, daysInMonth(y, m)) };
	return isValid(date) ? date : null;
}

function isDateComplete(value: PartialDate, granularity: DateGranularity): boolean {
	if (value.y == null) return false;
	if (granularity === 'year') return true;
	if (value.m == null) return false;
	if (granularity === 'month') return true;
	return value.d != null;
}

function isTimeComplete(value: PartialTime, granularity: TimeGranularity): boolean {
	if (value.h == null) return false;
	if (granularity === 'hour') return true;
	if (value.m == null) return false;
	if (granularity === 'minute') return true;
	return value.s != null;
}

/** Step a date segment. An empty segment fills from `placeholder` first (no skip past it). */
export function stepDate(
	value: PartialDate,
	type: 'year' | 'month' | 'day',
	delta: number,
	granularity: DateGranularity,
	placeholder: PartialDate,
	min?: string,
	max?: string
): PartialDate {
	const current = type === 'year' ? value.y : type === 'month' ? value.m : value.d;
	if (current == null) {
		const filled = {
			y: type === 'year' ? (placeholder.y ?? today().y) : value.y,
			m: type === 'month' ? (placeholder.m ?? today().m) : value.m,
			d: type === 'day' ? (placeholder.d ?? today().d) : value.d
		};
		return clampPartialDate(filled, granularity, min, max);
	}
	if (isDateComplete(value, granularity)) {
		const base = completeYmd(value, granularity, placeholder);
		if (!base) return value;
		const next =
			type === 'day' ? addDays(base, delta) : type === 'month' ? addMonths(base, delta) : addYears(base, delta);
		const clamped = clampDateIso(next, min, max);
		return {
			y: clamped.y,
			m: granularity === 'year' ? value.m : clamped.m,
			d: granularity !== 'day' ? value.d : clamped.d
		};
	}
	const limits = segmentLimits(type, value, 24);
	const raw = current + delta;
	const span = limits.max - limits.min + 1;
	const wrapped = ((((raw - limits.min) % span) + span) % span) + limits.min;
	const next = { ...value, [type === 'year' ? 'y' : type === 'month' ? 'm' : 'd']: type === 'year' ? expandYear(wrapped) : wrapped };
	if (next.y != null && next.m != null && next.d != null) {
		next.d = Math.min(next.d, daysInMonth(next.y, next.m));
	}
	return clampPartialDate(next, granularity, min, max);
}

function clampPartialDate(value: PartialDate, granularity: DateGranularity, min?: string, max?: string): PartialDate {
	const iso = dateToIso(value, granularity);
	if (!iso) return value;
	const parsed = parseIso(iso);
	if (!parsed) return value;
	const clamped = clampDateIso(parsed, min, max);
	if (toIso(clamped) === iso) return value;
	return {
		y: clamped.y,
		m: granularity === 'year' ? value.m : clamped.m,
		d: granularity !== 'day' ? value.d : clamped.d
	};
}

/** Step a time segment. Hour steps the underlying 0–23 value so 11 AM → 12 PM flips the period. */
export function stepTime(
	value: PartialTime,
	type: 'hour' | 'minute' | 'second' | 'dayPeriod',
	delta: number,
	granularity: TimeGranularity,
	placeholder: PartialTime,
	min?: string,
	max?: string
): PartialTime {
	if (type === 'dayPeriod') {
		const hour = value.h ?? placeholder.h ?? 0;
		const flipped = (hour + 12) % 24;
		const next = { ...value, h: value.h == null ? hour : flipped };
		return clampPartialTime(next, granularity, min, max);
	}
	const key = type === 'hour' ? 'h' : type === 'minute' ? 'm' : 's';
	if (value[key] == null) {
		const filled = { ...value, [key]: placeholder[key] ?? 0 };
		return clampPartialTime(filled, granularity, min, max);
	}
	if (isTimeComplete(value, granularity) || type === 'hour') {
		let h = value.h ?? placeholder.h ?? 0;
		let m = value.m ?? (granularity === 'hour' ? 0 : (placeholder.m ?? 0));
		let s = value.s ?? (granularity !== 'second' ? 0 : (placeholder.s ?? 0));
		if (type === 'hour') h = (h + delta + 24) % 24;
		if (type === 'minute') {
			const total = h * 60 + m + delta;
			const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
			h = Math.floor(wrapped / 60);
			m = wrapped % 60;
		}
		if (type === 'second') {
			const total = h * 3600 + m * 60 + s + delta;
			const wrapped = ((total % (24 * 3600)) + 24 * 3600) % (24 * 3600);
			h = Math.floor(wrapped / 3600);
			m = Math.floor((wrapped % 3600) / 60);
			s = wrapped % 60;
		}
		return clampPartialTime({ h, m: granularity === 'hour' ? value.m : m, s: granularity !== 'second' ? value.s : s }, granularity, min, max);
	}
	const limits = segmentLimits(type, emptyDate(), 24);
	const current = value[key] ?? 0;
	const raw = current + delta;
	const span = limits.max - limits.min + 1;
	const wrapped = ((((raw - limits.min) % span) + span) % span) + limits.min;
	return clampPartialTime({ ...value, [key]: wrapped }, granularity, min, max);
}

function clampPartialTime(value: PartialTime, granularity: TimeGranularity, min?: string, max?: string): PartialTime {
	const iso = timeToIso(value, granularity);
	if (!iso) return value;
	const parsed = parseTimeIso(iso);
	if (!parsed) return value;
	const clamped = clampTimeValue(parsed, min, max);
	if (toTimeIso(clamped, 'second') === toTimeIso(parsed, 'second')) return value;
	return {
		h: clamped.h,
		m: granularity === 'hour' ? value.m : clamped.m,
		s: granularity !== 'second' ? value.s : clamped.s
	};
}

export function setDateSegment(
	value: PartialDate,
	type: 'year' | 'month' | 'day',
	n: number | null,
	granularity: DateGranularity,
	min?: string,
	max?: string
): PartialDate {
	const next: PartialDate = {
		y: type === 'year' ? n : value.y,
		m: type === 'month' ? n : value.m,
		d: type === 'day' ? n : value.d
	};
	if (next.y != null && next.m != null && next.d != null) {
		next.d = Math.min(next.d, daysInMonth(next.y, next.m));
	}
	return clampPartialDate(next, granularity, min, max);
}

export function setTimeSegment(
	value: PartialTime,
	type: 'hour' | 'minute' | 'second' | 'dayPeriod',
	n: number | null,
	hourCycle: HourCycle,
	granularity: TimeGranularity,
	min?: string,
	max?: string
): PartialTime {
	if (type === 'dayPeriod') {
		if (n == null) return value;
		const hour = value.h ?? 0;
		const isPm = hour >= 12;
		const nextHour = n === 1 ? (isPm ? hour : (hour + 12) % 24) : isPm ? hour - 12 : hour;
		return clampPartialTime({ ...value, h: nextHour }, granularity, min, max);
	}
	if (type === 'hour' && n != null && hourCycle === 12) {
		const periodPm = (value.h ?? 0) >= 12;
		const mapped = periodPm ? (n === 12 ? 12 : n + 12) : n === 12 ? 0 : n;
		return clampPartialTime({ ...value, h: mapped }, granularity, min, max);
	}
	const key = type === 'hour' ? 'h' : type === 'minute' ? 'm' : 's';
	return clampPartialTime({ ...value, [key]: n }, granularity, min, max);
}

export interface TypeResult<T> {
	value: T;
	buffer: string;
	advance: boolean;
}

/** Type a digit into a numeric segment. `buffer` is the digits typed since the segment was focused. */
export function typeDigit<T extends PartialDate | PartialTime>(
	kind: 'date' | 'time',
	value: T,
	type: EditableType,
	buffer: string,
	digit: string,
	hourCycle: HourCycle,
	granularity: DateGranularity | TimeGranularity,
	min?: string,
	max?: string
): TypeResult<T> {
	if (type === 'dayPeriod' || !/^\d$/.test(digit)) {
		return { value, buffer, advance: false };
	}
	const nextBuffer = (buffer + digit).slice(type === 'year' ? -4 : -2);
	const n = Number(nextBuffer);
	const limits = segmentLimits(type, kind === 'date' ? (value as PartialDate) : emptyDate(), hourCycle);
	if (nextBuffer.length > 1 && (n < limits.min || n > limits.max)) {
		// Replace with the new digit alone if that digit is in range; otherwise ignore.
		if (Number(digit) >= limits.min && Number(digit) <= limits.max) {
			return typeDigit(kind, value, type, '', digit, hourCycle, granularity, min, max);
		}
		return { value, buffer, advance: false };
	}
	// A leading 0 is held in the buffer until a second digit makes a value in range.
	const inRange = n >= limits.min && n <= limits.max;
	const applied = !inRange
		? value
		: kind === 'date'
			? setDateSegment(value as PartialDate, type as 'year' | 'month' | 'day', n, granularity as DateGranularity, min, max)
			: setTimeSegment(value as PartialTime, type as 'hour' | 'minute' | 'second', n, hourCycle, granularity as TimeGranularity, min, max);
	const maxDigits = type === 'year' ? 4 : 2;
	const unique = nextBuffer.length === 1 && n * 10 > limits.max;
	const advance = inRange && (nextBuffer.length >= maxDigits || unique);
	return { value: applied as T, buffer: nextBuffer, advance };
}

export function clearSegment<T extends PartialDate | PartialTime>(
	kind: 'date' | 'time',
	value: T,
	type: EditableType,
	hourCycle: HourCycle,
	granularity: DateGranularity | TimeGranularity
): T {
	if (type === 'dayPeriod') return value;
	if (kind === 'date') {
		return setDateSegment(value as PartialDate, type as 'year' | 'month' | 'day', null, granularity as DateGranularity) as T;
	}
	return setTimeSegment(value as PartialTime, type as 'hour' | 'minute' | 'second', null, hourCycle, granularity as TimeGranularity) as T;
}

/** Map a typed character to a day-period value (0 = AM, 1 = PM), or null if it is not a period key. */
export function periodFromKey(key: string, locale: string | undefined): 0 | 1 | null {
	const lower = key.toLowerCase();
	if (lower === 'a') return 0;
	if (lower === 'p') return 1;
	const am = dayPeriodText(locale, 0);
	const pm = dayPeriodText(locale, 18);
	if (am && lower === am[0]?.toLowerCase()) return 0;
	if (pm && lower === pm[0]?.toLowerCase()) return 1;
	return null;
}

export function pageStep(type: EditableType): number {
	switch (type) {
		case 'year':
			return 10;
		case 'month':
			return 3;
		case 'day':
			return 7;
		case 'hour':
			return 4;
		case 'minute':
		case 'second':
			return 10;
		case 'dayPeriod':
			return 1;
	}
}

export function finalizeYearOnLeave(value: PartialDate, buffer: string, type: EditableType): PartialDate {
	if (type !== 'year' || value.y == null) return value;
	if (buffer.length > 0 && buffer.length < 4) {
		return { ...value, y: expandYear(Number(buffer)) };
	}
	if (value.y < 100) return { ...value, y: expandYear(value.y) };
	return value;
}
