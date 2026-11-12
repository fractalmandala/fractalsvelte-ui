/**
 * The shared prop axes. Every component that takes a variant, a size, a shape
 * or a tone takes THESE — the value is (or maps to) a fractalstyler class, so
 * the same word means the same thing on a button, an input, a card or a tag.
 */

/** Runtime list of visual styles — each value is a class of the same name. */
export const Variants = [
	'primary',
	'secondary',
	'themed',
	'outline',
	'ghost',
	'link',
	'soft',
	'info',
	'success',
	'warning',
	'danger'
] as const;

/** Visual style — each value is a class of the same name. */
export type Variant =
	| 'primary'
	| 'secondary'
	| 'themed'
	| 'outline'
	| 'ghost'
	| 'link'
	| 'soft'
	| 'info'
	| 'success'
	| 'warning'
	| 'danger';

/** Runtime list of control scales. */
export const Sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/** Control scale: height + text size. */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Default control size when a component or field does not set one. */
export const defaultSize: Size = 'md';

/** Runtime list of corner shapes — each value is a class of the same name. */
export const Shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;

/** Corner shape — each value is a class of the same name. */
export type Shape = 'rect' | 'mincurved' | 'modern' | 'curved' | 'round';

/** Runtime list of status colours. */
export const Tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const;

/** Status colour for messages, badges, meters. */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Runtime list of placements. */
export const Placements = [
	'top',
	'top-start',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'right'
] as const;

/** Where a floating element sits relative to its anchor. */
export type Placement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'right';

/** Runtime list of orientations. */
export const Orientations = ['horizontal', 'vertical'] as const;

export type Orientation = 'horizontal' | 'vertical';

/** Height + text classes for a control (button, input, select, toggle). */
export const sizeClass: Record<Size, string> = {
	xs: 'h-md text-xs',
	sm: 'h-bs text-sm',
	md: 'h-lg text-md',
	lg: 'h-xl text-bs',
	xl: 'h-2xl text-lg'
};

/** Height only — for square things (icon buttons, avatars, dots). */
export const heightClass: Record<Size, string> = {
	xs: 'h-md',
	sm: 'h-bs',
	md: 'h-lg',
	lg: 'h-xl',
	xl: 'h-2xl'
};

/** Text scale only. */
export const textClass: Record<Size, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-md',
	lg: 'text-bs',
	xl: 'text-lg'
};

/** Height from `size` and text from `textSize` (or `size` when omitted). */
export function controlSize(size: Size, textSize?: Size): string {
	return `${heightClass[size]} ${textClass[textSize ?? size]}`;
}

/** Padding for a surface (card, popover, dialog) at each size. */
export const padClass: Record<Size, string> = {
	xs: 'pad-sm',
	sm: 'pad-md',
	md: 'pad-bs',
	lg: 'pad-lg',
	xl: 'pad-xl'
};

/** `.floating` placement modifier for a Placement. */
export const placementClass: Record<Placement, string> = {
	top: 'at-top',
	'top-start': 'at-top-start',
	'top-end': 'at-top-end',
	bottom: 'at-bottom',
	'bottom-start': 'at-bottom-start',
	'bottom-end': 'at-bottom-end',
	left: 'at-left',
	right: 'at-right'
};

/** Text colour class for a tone. */
export const toneText: Record<Tone, string> = {
	neutral: 'text-secondary',
	info: 'text-info',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger'
};
