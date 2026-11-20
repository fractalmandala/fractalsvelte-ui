// Section alignment for the documentation site. No component in the library takes it.

/** Runtime list of overall alignment to place for large containers like cards, hero sections, etc. */
export const ControlAlignments = [
	'xleft', 'xright', 'xcenter', 'xcenter mleft', 'xright mleft', 'xleft mright', 'xcenter mright'
] as const;

/** Overall alignment inside any containing element, with options to switch at mobile views. */
export type ControlAlignment =
	| 'xleft'
	| 'xright'
	| 'xcenter'
	| 'xcenter mleft'
	| 'xright mleft'
	| 'xleft mright'
	| 'xcenter mright';
