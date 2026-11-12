// The props language. Every value below is a class defined in src/lib/styles
// (component-props.css and the layers beside it): a component puts the value
// straight into its class list, so nothing outside these unions is typed.

export const union = (values: readonly string[]): string =>
	values.map((v) => `'${v}'`).join(' | ');

export const CoreProps = [
	'variant', 'shape', 'size', 'shadow', 'icon'
] as const;
export type CoreProp = (typeof CoreProps)[number]

// Variant defines the aesthetic finish and looks of the component. Each value is a class of the same name.
export const Variants = [
	'primary',
	'secondary',
	'themed',
	'outline',
	'ghost',
	'link'
] as const;
export type Variant = (typeof Variants)[number];

// Size defines component heights primarily, along with padding and min-widths at larger sizes. Each value is a class of the same name.
export const Sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl'] as const;
export type Size = (typeof Sizes)[number];

export const Scales = ['scale-xs', 'scale-sm', 'scale-md', 'scale-bs', 'scale-lg', 'scale-xl', 'scale-2xl', 'scale-3xl'] as const;
export type Scale = (typeof Scales)[number];

// Shape defines the roundedness of the component, ie - border radius. Shape types range from no border-radius - set at 0px, to fully rounded - set at 9999px. Each value is a class of the same name.
export const Shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
export type Shape = (typeof Shapes)[number];

// Shadow defines the component's box shadow, with two kinds. The 'shad-' prefix assigns a static box shadow to the component, the 'shad-hover-' prefix assigns a box shadow which goes away on hover. Use only one of these, not both. Each value is a class of the same name.
export const Shadows = ['shad-none', 'shad-sm', 'shad-bs', 'shad-lg', 'shad-xl', 'shad-2xl', 'shad-hover-sm', 'shad-hover-bs', 'shad-hover-lg', 'shad-hover-xl', 'shad-hover-2xl'] as const;
export type Shadow = (typeof Shadows)[number];

// Components do not lock any text size, leaving it an open prop for the user to determine. The default size components usually ship with is 'text-md' or 'text-bs'. To edit it, simply use 1 of the text size types in the component class.
// For components like Accordion, a relationship is needed between 2 bodies of text. Accordion trigger text larger, content text smaller. 
export const TextSizes = ['text-xs', 'text-sm', 'text-md', 'text-bs', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'] as const;
export type TextSize = (typeof TextSizes)[number];
export const ChildTextSizes = ['text-xs', 'text-sm', 'text-md', 'text-bs'] as const;
export type ChildTextSize = (typeof ChildTextSizes)[number];

export const Spaces = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type Space = (typeof Spaces)[number];

export const Surfaces = ['bg-main', 'bg-surface', 'bg-panel', 'bg-overlay', 'state-hover', 'state-selected', 'bg-button', 'bg-input'] as const;
export type Surface = (typeof Surfaces)[number];

export const ThemeColors = ['theme-color', 'theme-color-up', 'theme-color-down'] as const;
export type ThemeColor = (typeof ThemeColors)[number];

export const Borders = ['border', 'border-subtle', 'border-strong', 'border-dashed', 'border-none', 'bb', 'bb-str', 'bb-sub', 'bb-dash'] as const;
export type Border = (typeof Borders)[number];

export const Messages = ['info', 'success', 'warning', 'danger', 'neutral'] as const;
export type Message = (typeof Messages)[number];

export const IconVariants = [
	'primary',
	'secondary',
	'themed',
	'outline',
	'ghost',
	'link'
] as const;
export type IconVariant = (typeof IconVariants)[number];


export const MessageTexts = ['text-info', 'text-success', 'text-warning', 'text-danger'] as const;
export type MessageText = (typeof MessageTexts)[number];

export const Weights = ['weight-300', 'weight-400', 'weight-500', 'weight-600', 'weight-700', 'weight-800'] as const;
export type Weight = (typeof Weights)[number];

export const Frames = ['frame-16-9', 'frame-9-16', 'frame-4-3', 'frame-3-4', 'frame-3-2', 'frame-2-3', 'frame-1-1'] as const;
export type Frame = (typeof Frames)[number];

export const ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	group?: string;
}

export interface Column<T = any> {
	key: keyof T & string;
	label: string;
	align?: 'left' | 'right' | 'center';
	sortable?: boolean;
}

export interface Point {
	x: number;
	y: number;
}

export interface AudioTrackItem {
	id?: string | number;
	title: string;
	artist?: string;
	album?: string;
	duration?: string | number;
	artwork?: string;
}
