import type { Snippet } from 'svelte';

export type SortDirection = 'asc' | 'desc';

export interface SortRule {
	key: string;
	direction: SortDirection;
}

export type ColumnAlign = 'left' | 'center' | 'right';

export interface Column<T extends object = object> {
	key: string;
	header: string | Snippet;
	cell?: Snippet<[{ row: T; value: unknown; index: number }]>;
	accessor?: keyof T | ((row: T) => unknown);
	sortable?: boolean;
	align?: ColumnAlign;
	width?: string;
	hidden?: boolean;
	filter?: (row: T, query: string) => boolean;
}

export function getValue<T extends object>(row: T, col: Column<T>): unknown {
	if (col.accessor == null) return (row as Record<string, unknown>)[col.key];
	if (typeof col.accessor === 'function') return col.accessor(row);
	return row[col.accessor];
}

export function rowId<T extends object>(
	row: T,
	rowKey: keyof T | ((row: T) => string),
	index: number
): string {
	if (typeof rowKey === 'function') return rowKey(row);
	const value = row[rowKey] as unknown;
	return value == null ? String(index) : String(value);
}

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

export function compareValues(a: unknown, b: unknown): number {
	if (a == null && b == null) return 0;
	if (a == null) return 1;
	if (b == null) return -1;
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

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

export function selectionStatus(keys: string[], selected: Set<string>): 'none' | 'some' | 'all' {
	if (keys.length === 0) return 'none';
	let n = 0;
	for (const key of keys) if (selected.has(key)) n += 1;
	if (n === 0) return 'none';
	if (n === keys.length) return 'all';
	return 'some';
}

export function toggleKey(selected: Set<string>, key: string, on?: boolean): Set<string> {
	const next = new Set(selected);
	const should = on ?? !next.has(key);
	if (should) next.add(key);
	else next.delete(key);
	return next;
}

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

export function setKeys(selected: Set<string>, keys: string[], on: boolean): Set<string> {
	const next = new Set(selected);
	if (on) for (const key of keys) next.add(key);
	else for (const key of keys) next.delete(key);
	return next;
}

export function pageWindow(page: number, pageCount: number, radius = 2): number[] {
	if (pageCount <= 0) return [];
	const start = Math.max(1, page - radius);
	const end = Math.min(pageCount, page + radius);
	const pages: number[] = [];
	for (let n = start; n <= end; n += 1) pages.push(n);
	return pages;
}
