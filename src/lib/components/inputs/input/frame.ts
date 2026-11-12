import { controlSize, textClass, type Shape, type Size } from '../../../internal/tokens.js';

/** The look of a framed control. */
export type FrameVariant = 'outline' | 'filled' | 'ghost';

export interface FrameOptions {
	variant: FrameVariant;
	size: Size;
	/** Text scale, independent of the frame height. Follows `size` when omitted. */
	textSize?: Size;
	shape: Shape;
	invalid: boolean;
	disabled: boolean;
	/** Height follows the content (a text area) instead of the size's fixed height. */
	content?: boolean;
	/** At least the size's height, taller as content wraps (a token field). */
	grow?: boolean;
}

/**
 * The classes of a text-entry frame, shared by every input in the kit. The frame
 * is a `.field`, so it draws the focus ring for whatever is focused inside it.
 */
export function frameClasses({ variant, size, textSize, shape, invalid, disabled, content = false, grow = false }: FrameOptions): string[] {
	const out = ['field row ycenter wfull', size === 'xs' || size === 'sm' ? 'px-sm gap-xs' : 'px-md gap-sm', shape];
	out.push(content ? `${textClass[textSize ?? size]} py-sm` : controlSize(size, textSize));
	if (grow) out.push('hgrow py-xs');
	if (variant === 'outline') out.push('bg-input border');
	else if (variant === 'filled') out.push('state-selected', invalid ? 'border' : 'border-none');
	else out.push('bg-none hover-fill', invalid ? 'border' : 'border-none');
	if (invalid) out.push('is-invalid');
	if (disabled) out.push('disabled');
	return out;
}

/**
 * Pointer-down on the padding or a decoration of a frame focuses its control, as
 * clicking a native field would. Clicks on interactive children are left alone.
 */
export function focusFrame(event: PointerEvent, control: HTMLElement | null | undefined): void {
	const target = event.target;
	if (!(target instanceof Element) || target.closest('button, a, input, textarea, select, [tabindex]')) return;
	event.preventDefault();
	control?.focus();
}
