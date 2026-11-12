import type { IconData } from '@fractaldesign/icons';

/** One chip in a ChipGroup. `T` is the type of the value it stands for. */
export interface ChipOption<T = string> {
	/** The value written to `value` when the chip is chosen. */
	value: T;
	/** The visible label. */
	label: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** A count drawn after the label, for filter chips that summarise a set. */
	count?: number;
	/** Shown but not choosable. */
	disabled?: boolean;
}

/** A string for a value — the form value of a hidden input, and a stable DOM key. */
export function valueKey(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
