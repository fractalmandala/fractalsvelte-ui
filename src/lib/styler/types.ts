// Axis unions for the fractalstyler edition. These are the values the compiled
// fractalstyler stylesheet answers on data-variant / data-size / data-shape /
// data-pad — nothing outside them resolves, so nothing outside them is typed.

export const union = (values: readonly string[]): string =>
	values.map((v) => `'${v}'`).join(' | ');

export const CoreProps = [
	'variant', 'shape', 'size', 'shadow', 'icon'
] as const;
export type CoreProp = (typeof CoreProps)[number]

export const Variants = [
	'primary',
	'secondary',
	'themed',
	'outline',
	'ghost',
	'link'
] as const;
export type Variant = (typeof Variants)[number];

export const Sizes = ['h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl'] as const;
export type Size = (typeof Sizes)[number];

export const Shapes = ['square', 'min', 'modern', 'curved', 'round'] as const;
export type Shape = (typeof Shapes)[number];

export const Shadows = ['shad-none', 'shad-sm', 'shad-bs', 'shad-lg', 'shad-xl', 'shad-2xl', 'shad-hover-sm', 'shad-hover-bs', 'shad-hover-lg', 'shad-hover-xl', 'shad-hover-2xl'] as const;
export type Shadow = (typeof Shadows)[number];

export const Pads = ['pad-sm', 'pad-md', 'pad-bs', 'pad-lg', 'pad-xl'] as const;
export type Pad = (typeof Pads)[number];

export const Spaces = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type Space = (typeof Spaces)[number];

export const Surfaces = ['bg-main', 'bg-surface', 'bg-panel', 'bg-sunken', 'bg-raised', 'bg-extra', 'state-surface', 'state-hover', 'state-selected','bg-button', 'bg-input'] as const;
export type Surface = (typeof Surfaces)[number];

export const ThemeColors = ['theme-color', 'theme-color-alt', 'theme-color-sub'] as const;
export type ThemeColor = (typeof ThemeColors)[number];

export const Borders = ['border', 'border-subtle', 'border-strong', 'border-none'] as const;
export type Border = (typeof Borders)[number];

export const Messages = ['info', 'success', 'warning', 'danger'] as const;
export type Message = (typeof Messages)[number];

export const Icons = [
	'primary',
	'secondary',
	'themed',
	'outline',
	'ghost',
	'link'
] as const;
export type Icon = (typeof Icons)[number];
export const MessageTexts = ['text-info', 'text-success', 'text-warning', 'text-danger'] as const;
export type MessageText = (typeof MessageTexts)[number];

export const TextSizes = ['text-xs', 'text-sm', 'text-md', 'text-bs', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'] as const;
export type TextSize = (typeof TextSizes)[number];

export const Weights = ['weight-300', 'weight-400', 'weight-500', 'weight-600', 'weight-700', 'weight-800'] as const;
export type Weight = (typeof Weights)[number];

export const Frames = ['frame-16-9', 'frame-9-16', 'frame-4-3', 'frame-3-4', 'frame-3-2', 'frame-2-3', 'frame-1-1'] as const;
export type Frame = (typeof Frames)[number];

export const ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const INTENTS = ['info', 'success', 'warning', 'danger'] as const;
export type Intent = (typeof INTENTS)[number];