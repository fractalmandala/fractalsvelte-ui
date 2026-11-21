import type { IconData } from '@fractaldesign/icons';

export interface ChipOption<T = string> {
	value: T;
	label: string;
	icon?: IconData;
	count?: number;
	disabled?: boolean;
}

export function valueKey(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
