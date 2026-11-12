/** Row density of a table. */
export type TableSize = 'sm' | 'md' | 'lg';

/** Horizontal alignment of a cell's content. */
export type TableAlign = 'left' | 'center' | 'right';

/** The `.data-table` density modifier for a size. */
export const densityClass: Record<TableSize, string> = {
	sm: 'dense',
	md: '',
	lg: 'roomy'
};

/** The text-alignment class for an alignment. */
export const alignClass: Record<TableAlign, string> = {
	left: 'ta-l',
	center: 'ta-c',
	right: 'ta-r'
};

/** The alignment class for a cell: `align` when given, otherwise right for numbers and left for text. */
export function cellAlign(align: TableAlign | undefined, numeric: boolean): string {
	return alignClass[align ?? (numeric ? 'right' : 'left')];
}
