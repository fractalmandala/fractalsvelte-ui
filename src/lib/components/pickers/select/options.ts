import type { IconData } from '@fractaldesign/icons';

/** One choice in a Select or Combobox. `T` is the type of the value it stands for. */
export interface SelectOption<T = string> {
	/** The value written to `value` when the option is chosen. */
	value: T;
	/** The visible label; also what typeahead and filtering match against. */
	label: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** A second, quieter line under the label. */
	description?: string;
	/** Shown but not choosable. */
	disabled?: boolean;
	/** Options with the same group name are listed together under that heading. */
	group?: string;
}

/** Options in groups, keeping the order in which each group first appears. Ungrouped options form a group with no heading. */
export function groupOptions<T>(options: readonly SelectOption<T>[]): { group: string | null; options: SelectOption<T>[] }[] {
	const groups: { group: string | null; options: SelectOption<T>[] }[] = [];
	for (const option of options) {
		const key = option.group ?? null;
		let bucket = groups.find((g) => g.group === key);
		if (!bucket) {
			bucket = { group: key, options: [] };
			groups.push(bucket);
		}
		bucket.options.push(option);
	}
	return groups;
}

/** A string for a value — the form value of a hidden input, and a stable DOM id fragment. */
export function valueKey(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
