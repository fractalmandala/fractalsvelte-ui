// Single source of truth for Fractal UI runtime unions and derived TypeScript types.
// Follows the as const array + derived union pattern for zero-drift runtime introspection.

/**
 * Formats a values array as a documentation union string — `'a' | 'b'`.
 */
export const union = (values: readonly string[]): string =>
	values.map((v) => `'${v}'`).join(' | ');

// Visual emphasis variants
export const VARIANTS = [
	'primary',
	'secondary',
	'soft',
	'outline',
	'ghost',
	'destructive',
	'surface'
] as const;
export type Variant = (typeof VARIANTS)[number];

// Component sizing scale
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof SIZES)[number];

// Corner curvature shapes
export const SHAPES = ['square', 'rounded', 'pill'] as const;
export type Shape = (typeof SHAPES)[number];

// Semantic feedback intents
export const INTENTS = ['info', 'success', 'warning', 'danger'] as const;
export type Intent = (typeof INTENTS)[number];

// Button HTML types
export const BTN_TYPES = ['button', 'submit', 'reset'] as const;
export type BtnType = (typeof BTN_TYPES)[number];

// Orientations
export const ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

// Popover / Tooltip placements
export const PLACEMENTS = [
	'top',
	'top-start',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end',
	'right',
	'right-start',
	'right-end'
] as const;
export type Placement = (typeof PLACEMENTS)[number];

// Alignment options
export const ALIGNS = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
export type Align = (typeof ALIGNS)[number];

// Justify options
export const JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;
export type Justify = (typeof JUSTIFIES)[number];

// Spacing token scale
export const SPACES = ['none', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type Space = (typeof SPACES)[number];

// Animation speed presets
export const SPEEDS = ['fast', 'normal', 'slow'] as const;
export type Speed = (typeof SPEEDS)[number];

// Full theme tokens contract
export interface DesignTokens {
	// Backgrounds
	'--f-bg': string;
	'--f-surface': string;
	'--f-panel': string;
	'--f-sunken': string;
	'--f-raised': string;
	'--f-overlay': string;
	'--f-input': string;
	'--f-hover': string;
	'--f-active': string;

	// Typography
	'--f-text': string;
	'--f-text-muted': string;
	'--f-text-subtle': string;
	'--f-text-inverse': string;

	// Borders & Rings
	'--f-border': string;
	'--f-border-subtle': string;
	'--f-border-strong': string;
	'--f-ring': string;

	// Brand / Primary
	'--f-primary': string;
	'--f-primary-hover': string;
	'--f-primary-active': string;
	'--f-primary-subtle': string;
	'--f-primary-text': string;

	// Accent
	'--f-accent': string;
	'--f-accent-hover': string;
	'--f-accent-subtle': string;

	// Semantic Intents
	'--f-success': string;
	'--f-success-bg': string;
	'--f-success-text': string;
	'--f-warning': string;
	'--f-warning-bg': string;
	'--f-warning-text': string;
	'--f-danger': string;
	'--f-danger-bg': string;
	'--f-danger-text': string;
	'--f-info': string;
	'--f-info-bg': string;
	'--f-info-text': string;

	// Corner Radii
	'--f-radius-xs': string;
	'--f-radius-sm': string;
	'--f-radius-md': string;
	'--f-radius-lg': string;
	'--f-radius-xl': string;
	'--f-radius-full': string;

	// Shadows
	'--f-shadow-xs': string;
	'--f-shadow-sm': string;
	'--f-shadow-md': string;
	'--f-shadow-lg': string;
	'--f-shadow-xl': string;
	'--f-shadow-glow': string;
}
