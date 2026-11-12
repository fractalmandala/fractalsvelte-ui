import type { Snippet } from 'svelte';

/** Sort direction of one column. */
export type SortDirection = 'asc' | 'desc';

/** One column in a multi-column sort. */
export interface SortRule {
	key: string;
	direction: SortDirection;
}

/** Horizontal alignment of a data-table column. */
export type ColumnAlign = 'left' | 'center' | 'right';

/** A column definition, generic over the row type. */
export interface Column<T extends object = object> {
	/** Stable id, and the default field read from each row. */
	key: string;
	/** Header label, or a snippet for custom header content. */
	header: string | Snippet;
	/** Custom cell content. Receives the row, the accessed value and the row index. */
	cell?: Snippet<[{ row: T; value: unknown; index: number }]>;
	/** How to read the cell value; defaults to `row[key]`. */
	accessor?: keyof T | ((row: T) => unknown);
	/** When true, the header is a sort button. */
	sortable?: boolean;
	/** Horizontal alignment of the header and cells. */
	align?: ColumnAlign;
	/** A fixed column width (any CSS length, e.g. `8rem` or `20%`). */
	width?: string;
	/** Hide the column until the user reveals it in the columns menu. */
	hidden?: boolean;
	/** When a global filter is set, return true if this column matches the query. */
	filter?: (row: T, query: string) => boolean;
}

/** Read a column's value from a row. */
export function getValue<T extends object>(row: T, col: Column<T>): unknown {
	if (col.accessor == null) return (row as Record<string, unknown>)[col.key];
	if (typeof col.accessor === 'function') return col.accessor(row);
	return row[col.accessor];
}

/** The row's stable key as a string. */
export function rowId<T extends object>(
	row: T,
	rowKey: keyof T | ((row: T) => string),
	index: number
): string {
	if (typeof rowKey === 'function') return rowKey(row);
	const value = row[rowKey] as unknown;
	return value == null ? String(index) : String(value);
}

/** Whether a row matches the global filter text. */
export function matchesFilter<T extends object>(
	row: T,
	columns: Column<T>[],
	query: string
): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return columns.some((col) => {
		if (col.filter) return col.filter(row, query);
		const value = getValue(row, col);
		return value != null && String(value).toLowerCase().includes(q);
	});
}

/** Compare two cell values: numbers, dates, then numeric-aware strings. */
export function compareValues(a: unknown, b: unknown): number {
	if (a == null && b == null) return 0;
	if (a == null) return 1;
	if (b == null) return -1;
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Sort a copy of the rows by the current multi-column sort. */
export function sortRows<T extends object>(
	rows: T[],
	sort: SortRule[],
	columns: Column<T>[]
): T[] {
	if (sort.length === 0) return rows;
	const byKey = new Map(columns.map((col) => [col.key, col]));
	return [...rows].sort((left, right) => {
		for (const rule of sort) {
			const col = byKey.get(rule.key);
			const av = col ? getValue(left, col) : (left as Record<string, unknown>)[rule.key];
			const bv = col ? getValue(right, col) : (right as Record<string, unknown>)[rule.key];
			const cmp = compareValues(av, bv);
			if (cmp !== 0) return rule.direction === 'asc' ? cmp : -cmp;
		}
		return 0;
	});
}

/**
 * Cycle a column through asc → desc → off.
 * With `multi` (shift-click), other columns stay in the sort; otherwise this column replaces it.
 */
export function cycleSort(sort: SortRule[], key: string, multi: boolean): SortRule[] {
	const current = sort.find((rule) => rule.key === key);
	if (!multi) {
		if (!current) return [{ key, direction: 'asc' }];
		if (current.direction === 'asc') return [{ key, direction: 'desc' }];
		return [];
	}
	if (!current) return [...sort, { key, direction: 'asc' }];
	if (current.direction === 'asc') {
		return sort.map((rule) => (rule.key === key ? { key, direction: 'desc' } : rule));
	}
	return sort.filter((rule) => rule.key !== key);
}

/** How many of `keys` are in the selection. */
export function selectionStatus(keys: string[], selected: Set<string>): 'none' | 'some' | 'all' {
	if (keys.length === 0) return 'none';
	let n = 0;
	for (const key of keys) if (selected.has(key)) n += 1;
	if (n === 0) return 'none';
	if (n === keys.length) return 'all';
	return 'some';
}

/** Return a new Set with `key` added or removed. */
export function toggleKey(selected: Set<string>, key: string, on?: boolean): Set<string> {
	const next = new Set(selected);
	const should = on ?? !next.has(key);
	if (should) next.add(key);
	else next.delete(key);
	return next;
}

/** Inclusive range of keys between two ids, in the order of `keys`. */
export function rangeKeys(keys: string[], from: string, to: string): string[] {
	const a = keys.indexOf(from);
	const b = keys.indexOf(to);
	if (a < 0 && b < 0) return [];
	if (a < 0) return [to];
	if (b < 0) return [from];
	const lo = Math.min(a, b);
	const hi = Math.max(a, b);
	return keys.slice(lo, hi + 1);
}

/** Add or remove every key in `keys` from the selection. */
export function setKeys(selected: Set<string>, keys: string[], on: boolean): Set<string> {
	const next = new Set(selected);
	if (on) for (const key of keys) next.add(key);
	else for (const key of keys) next.delete(key);
	return next;
}

/** The 1-based page numbers to show around the current page. */
export function pageWindow(page: number, pageCount: number, radius = 2): number[] {
	if (pageCount <= 0) return [];
	const start = Math.max(1, page - radius);
	const end = Math.min(pageCount, page + radius);
	const pages: number[] = [];
	for (let n = start; n <= end; n += 1) pages.push(n);
	return pages;
}
