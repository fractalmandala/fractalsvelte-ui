// Axis unions for the fractalstyler edition. These are the values the compiled
// fractalstyler stylesheet answers on data-variant / data-size / data-shape /
// data-pad — nothing outside them resolves, so nothing outside them is typed.

export { union } from '../types';
export type { Intent, Orientation, BtnType } from '../types';

// button, a.btn
export const FS_VARIANTS = [
	'primary',
	'secondary',
	'soft',
	'outline',
	'ghost',
	'link',
	'destructive'
] as const;
export type FsVariant = (typeof FS_VARIANTS)[number];

// .input, .select
export const FS_FIELD_VARIANTS = ['primary', 'secondary', 'soft', 'outline', 'ghost'] as const;
export type FsFieldVariant = (typeof FS_FIELD_VARIANTS)[number];

// .card
export const FS_CARD_VARIANTS = ['primary', 'secondary', 'soft', 'outline', 'ghost', 'link'] as const;
export type FsCardVariant = (typeof FS_CARD_VARIANTS)[number];

// button, a.btn, .input, .select (heights 20 / 24 / 28 / 32px)
export const FS_SIZES = ['sm', 'md', 'bs', 'lg'] as const;
export type FsSize = (typeof FS_SIZES)[number];

// button, a.btn, .input, .select
export const FS_SHAPES = ['square', 'modern', 'curved', 'round'] as const;
export type FsShape = (typeof FS_SHAPES)[number];

// .card has no square shape
export const FS_CARD_SHAPES = ['modern', 'curved', 'round'] as const;
export type FsCardShape = (typeof FS_CARD_SHAPES)[number];

// .card[data-pad]
export const FS_PADS = ['sm', 'md', 'bs', 'lg', 'xl'] as const;
export type FsPad = (typeof FS_PADS)[number];

// The eight steps every space family (.gap-*, .pad-*, .mar-* ...) is generated on
export const FS_SPACES = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl'] as const;
export type FsSpace = (typeof FS_SPACES)[number];

// .radius-*
export const FS_RADII = ['xs', 'sm', 'md', 'bs', 'lg', 'full'] as const;
export type FsRadius = (typeof FS_RADII)[number];

// .shadow-*
export const FS_SHADOWS = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl'] as const;
export type FsShadow = (typeof FS_SHADOWS)[number];

// Surface fills (.bg-*)
export const FS_SURFACES = ['main', 'surface', 'panel', 'sunken', 'raised', 'extra'] as const;
export type FsSurface = (typeof FS_SURFACES)[number];

// Status / tone used by feedback components
export const FS_TONES = ['neutral', 'theme', 'info', 'success', 'warning', 'danger'] as const;
export type FsTone = (typeof FS_TONES)[number];
