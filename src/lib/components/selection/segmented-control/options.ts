import type { IconData } from '@fractaldesign/icons';

/** One segment in a SegmentedControl. `T` is the type of the value it stands for. */
export interface SegmentOption<T = string> {
	/** The value written to `value` when the segment is chosen. */
	value: T;
	/** The visible label. */
	label: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** Shown but not choosable. */
	disabled?: boolean;
}

/** A string for a value — the form value of a hidden input, and a stable DOM key. */
export function valueKey(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
