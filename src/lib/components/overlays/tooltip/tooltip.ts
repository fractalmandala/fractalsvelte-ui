import type { Attachment } from 'svelte/attachments';
import type { Placement } from '../../../internal/tokens.js';

export const enterFrom: Record<Placement, string> = {
	top: 'enter-up',
	'top-start': 'enter-up',
	'top-end': 'enter-up',
	bottom: 'enter-down',
	'bottom-start': 'enter-down',
	'bottom-end': 'enter-down',
	left: 'enter-left',
	'left-start': 'enter-left',
	'left-end': 'enter-left',
	right: 'enter-right',
	'right-start': 'enter-right',
	'right-end': 'enter-right'
};

const WARM_WINDOW = 800;
let warmUntil = 0;

export function openDelay(delay: number): number {
	return Date.now() < warmUntil ? 0 : delay;
}

export function markWarm(): void {
	warmUntil = Date.now() + WARM_WINDOW;
}

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
