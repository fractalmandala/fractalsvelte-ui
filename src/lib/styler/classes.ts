// Lookup tables from an axis value to the fractalstyler class that renders it.
// Components never build a class name by string concatenation: every class they
// can emit is spelled out here (or in their markup), so scripts/styler-check.mjs
// can prove each one exists in the compiled stylesheet.

import type { FsFieldVariant, FsRadius, FsShadow, FsShape, FsSize, FsSpace, FsSurface, FsTone } from './types';

export const GAP: Record<FsSpace, string> = {
	xs: 'gap-xs',
	sm: 'gap-sm',
	md: 'gap-md',
	bs: 'gap-bs',
	lg: 'gap-lg',
	xl: 'gap-xl',
	'2xl': 'gap-2xl',
	'3xl': 'gap-3xl'
};

export const PAD: Record<FsSpace, string> = {
	xs: 'pad-xs',
	sm: 'pad-sm',
	md: 'pad-md',
	bs: 'pad-bs',
	lg: 'pad-lg',
	xl: 'pad-xl',
	'2xl': 'pad-2xl',
	'3xl': 'pad-3xl'
};

export const PX: Record<FsSpace, string> = {
	xs: 'px-xs',
	sm: 'px-sm',
	md: 'px-md',
	bs: 'px-bs',
	lg: 'px-lg',
	xl: 'px-xl',
	'2xl': 'px-2xl',
	'3xl': 'px-3xl'
};

export const PY: Record<FsSpace, string> = {
	xs: 'py-xs',
	sm: 'py-sm',
	md: 'py-md',
	bs: 'py-bs',
	lg: 'py-lg',
	xl: 'py-xl',
	'2xl': 'py-2xl',
	'3xl': 'py-3xl'
};

export const MY: Record<FsSpace, string> = {
	xs: 'my-xs',
	sm: 'my-sm',
	md: 'my-md',
	bs: 'my-bs',
	lg: 'my-lg',
	xl: 'my-xl',
	'2xl': 'my-2xl',
	'3xl': 'my-3xl'
};

export const RADIUS: Record<FsRadius, string> = {
	xs: 'radius-xs',
	sm: 'radius-sm',
	md: 'radius-md',
	bs: 'radius-bs',
	lg: 'radius-lg',
	full: 'radius-full'
};

export const SHADOW: Record<FsShadow, string> = {
	xs: 'shadow-xs',
	sm: 'shadow-sm',
	md: 'shadow-md',
	bs: 'shadow-bs',
	lg: 'shadow-lg',
	xl: 'shadow-xl',
	'2xl': 'shadow-2xl',
	'3xl': 'shadow-3xl'
};

export const SURFACE: Record<FsSurface, string> = {
	main: 'bg-main',
	surface: 'bg-surface',
	panel: 'bg-panel',
	sunken: 'bg-sunken',
	raised: 'bg-raised',
	extra: 'bg-extra'
};

// Ink for a tone
export const TONE_TEXT: Record<FsTone, string> = {
	neutral: 'text-secondary',
	theme: 'text-theme',
	info: 'text-info',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger'
};

// Solid fill for a tone (status dots, filled chips); neutral and theme have no
// solid status fill, so they fall back to a raised surface.
export const TONE_FILL: Record<FsTone, string> = {
	neutral: 'bg-raised',
	theme: 'bg-raised',
	info: 'bg-info',
	success: 'bg-success',
	warning: 'bg-warning',
	danger: 'bg-danger'
};

export const TEXT_SIZE = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-md',
	bs: 'text-bs',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl'
} as const;
export type FsTextSize = keyof typeof TEXT_SIZE;

export const WEIGHT = {
	300: 'weight-300',
	400: 'weight-400',
	500: 'weight-500',
	600: 'weight-600',
	700: 'weight-700',
	800: 'weight-800'
} as const;
export type FsWeight = keyof typeof WEIGHT;

export const GRID_COLS = {
	1: 'grid-1',
	2: 'grid-2',
	3: 'grid-3',
	4: 'grid-4',
	5: 'grid-5',
	6: 'grid-6'
} as const;
export type FsColumns = keyof typeof GRID_COLS;

export const COL_SPAN = {
	1: 'cspan-1',
	2: 'cspan-2',
	3: 'cspan-3',
	4: 'cspan-4',
	5: 'cspan-5',
	6: 'cspan-6',
	7: 'cspan-7',
	8: 'cspan-8'
} as const;
export type FsSpan = keyof typeof COL_SPAN;

export const FRAME = {
	'16/9': 'frame-16-9',
	'9/16': 'frame-9-16',
	'4/3': 'frame-4-3',
	'3/4': 'frame-3-4',
	'3/2': 'frame-3-2',
	'2/3': 'frame-2-3',
	'1/1': 'frame-1-1'
} as const;
export type FsRatio = keyof typeof FRAME;

export const CGAP: Record<FsSpace, string> = {
	xs: 'cgap-xs',
	sm: 'cgap-sm',
	md: 'cgap-md',
	bs: 'cgap-bs',
	lg: 'cgap-lg',
	xl: 'cgap-xl',
	'2xl': 'cgap-2xl',
	'3xl': 'cgap-3xl'
};

export const RGAP: Record<FsSpace, string> = {
	xs: 'rgap-xs',
	sm: 'rgap-sm',
	md: 'rgap-md',
	bs: 'rgap-bs',
	lg: 'rgap-lg',
	xl: 'rgap-xl',
	'2xl': 'rgap-2xl',
	'3xl': 'rgap-3xl'
};

export const MX: Record<FsSpace, string> = {
	xs: 'mx-xs',
	sm: 'mx-sm',
	md: 'mx-md',
	bs: 'mx-bs',
	lg: 'mx-lg',
	xl: 'mx-xl',
	'2xl': 'mx-2xl',
	'3xl': 'mx-3xl'
};

// --- Alignment ----------------------------------------------------------------
// x/y are physical axes in fractalstyler, so the same intent maps to different
// modifiers on a .row and a .box. Each must sit on an element carrying its base.

export type FsJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FsAlign = 'start' | 'center' | 'end' | 'stretch';

export const ROW_JUSTIFY: Record<FsJustify, string> = {
	start: 'xleft',
	center: 'xcenter',
	end: 'xright',
	between: 'xbetween',
	around: 'xaround',
	evenly: 'xevenly'
};

export const ROW_ALIGN: Record<FsAlign, string> = {
	start: 'ytop',
	center: 'ycenter',
	end: 'ybot',
	stretch: ''
};

export const BOX_JUSTIFY: Record<FsJustify, string> = {
	start: 'ytop',
	center: 'ycenter',
	end: 'ybot',
	between: 'ybetween',
	around: 'yaround',
	evenly: 'yevenly'
};

export const BOX_ALIGN: Record<FsAlign, string> = {
	start: 'xleft',
	center: 'xcenter',
	end: 'xright',
	stretch: ''
};

// Grid: items on both axes
export const GRID_ALIGN: Record<FsAlign, string> = {
	start: 'ytop',
	center: 'ycenter',
	end: 'ybot',
	stretch: 'ystretch'
};

export const GRID_JUSTIFY: Record<FsAlign, string> = {
	start: 'xleft',
	center: 'xcenter',
	end: 'xright',
	stretch: 'xstretch'
};

// --- Page measures ----------------------------------------------------------
export type FsMeasure = 'half' | 'wide' | 'full' | 'fluid' | 'prose';
export const MEASURE: Record<FsMeasure, string> = {
	half: 'content-section narrow-half',
	wide: 'content-section narrow-wide',
	full: 'content-section narrow-full',
	fluid: 'content-section',
	prose: 'prose'
};

// --- Composite fields -----------------------------------------------------
// .input / .select paint themselves, but .input is display:block and cannot be
// a flex row, so a field with affixes (icon, clear button, steppers, chips) is a
// .row frame painted with the nearest bare classes, holding a ghost .input.

export const FIELD_PAINT: Record<FsFieldVariant, string> = {
	primary: 'bg-sunken border-strong',
	secondary: 'bg-panel border',
	soft: 'bg-surface border-subtle',
	outline: 'bg-main border-strong',
	ghost: 'bg-surface'
};

export const FIELD_HEIGHT: Record<FsSize, string> = {
	sm: 'h-sm text-sm',
	md: 'h-md text-sm',
	bs: 'h-bs text-bs',
	lg: 'h-lg text-bs'
};

// Font size for fields that grow with their content (textarea, tag input)
export const FIELD_TEXT: Record<FsSize, string> = {
	sm: 'text-sm',
	md: 'text-sm',
	bs: 'text-bs',
	lg: 'text-bs'
};

export const SHAPE_RADIUS: Record<FsShape, string> = {
	square: '',
	modern: 'radius-sm',
	curved: 'radius-md',
	round: 'radius-full'
};

/** Joins class fragments, dropping falsy ones. */
export function cx(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(' ');
}
