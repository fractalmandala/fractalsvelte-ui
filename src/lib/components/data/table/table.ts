export type { Density } from '../../../internal/tokens.js';

export type TableSize = 'sm' | 'md' | 'lg';

export type TableAlign = 'left' | 'center' | 'right';

export const densityClass: Record<string, string> = {
	sm: 'dense',
	md: '',
	lg: 'roomy'
};

export const alignClass: Record<TableAlign, string> = {
	left: 'ta-l',
	center: 'ta-c',
	right: 'ta-r'
};

export function cellAlign(align: TableAlign | undefined, numeric: boolean): string {
	return alignClass[align ?? (numeric ? 'right' : 'left')];
}
