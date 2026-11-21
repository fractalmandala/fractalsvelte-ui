import type { IconData } from '@fractaldesign/icons';

export interface SelectOption<T = string> {
	value: T;
	label: string;
	icon?: IconData;
	description?: string;
	disabled?: boolean;
	group?: string;
}

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

export function valueKey(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
