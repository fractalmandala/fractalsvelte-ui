import type { Attachment } from 'svelte/attachments';
import type { Placement } from '../../../internal/tokens.js';

/** Enter class so the hint originates from the trigger side. */
export const enterFrom: Record<Placement, string> = {
	top: 'enter-up',
	'top-start': 'enter-up',
	'top-end': 'enter-up',
	bottom: 'enter-down',
	'bottom-start': 'enter-down',
	'bottom-end': 'enter-down',
	left: 'enter-left',
	right: 'enter-right'
};

/** Window after a tooltip closes during which the next one opens instantly. */
const WARM_WINDOW = 800;
let warmUntil = 0;

/** The delay to use for this open, or `0` when the group is still warm. */
export function openDelay(delay: number): number {
	return Date.now() < warmUntil ? 0 : delay;
}

/** Mark the shared group as warm, so a neighbouring tooltip opens instantly. */
export function markWarm(): void {
	warmUntil = Date.now() + WARM_WINDOW;
}

/**
 * Prefer `popover="hint"` (does not trap pointer or focus). Fall back to
 * `manual` when the engine does not implement hint.
 */
export function hintPopover(): Attachment<HTMLElement> {
	return (node) => {
		try {
			node.popover = 'hint';
			if (node.popover !== 'hint') node.popover = 'manual';
		} catch {
			try {
				node.popover = 'manual';
			} catch {
				// No Popover API — popoverSync will no-op on showPopover.
			}
		}
	};
}
