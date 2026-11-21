import type { Shape, Size, TextSize, Variant } from '../../../internal/tokens.js';

export interface FrameOptions {
	variant: Variant;
	size: Size;
	textSize?: TextSize;
	shape: Shape;
	invalid: boolean;
	disabled: boolean;
	content?: boolean;
	grow?: boolean;
}

export function frameClasses({
	variant,
	size,
	textSize,
	shape,
	invalid,
	disabled,
	content = false,
	grow = false
}: FrameOptions): string[] {
	const compact = size === 'h-xs' || size === 'h-sm';
	const text = textSize ?? 'text-md';
	const out = ['field row ycenter wfull', compact ? 'px-sm gap-xs' : 'px-md gap-sm', size, shape];

	// A text area and a growing token field carry their own padding and no fixed height.
	out.push(content ? `${text} py-sm` : text);
	if (grow) out.push('hgrow py-xs');

	if (variant === 'ghost') out.push('bg-none hover-fill', invalid ? 'border' : 'border-none');
	else if (variant === 'secondary') out.push('state-selected', invalid ? 'border' : 'border-none');
	else out.push('bg-input border');

	if (invalid) out.push('is-invalid');
	if (disabled) out.push('disabled');

	return out;
}

export function focusFrame(event: PointerEvent, control: HTMLElement | null | undefined): void {
	const target = event.target;
	if (!(target instanceof Element) || target.closest('button, a, input, textarea, select, [tabindex]')) return;
	event.preventDefault();
	control?.focus();
}
