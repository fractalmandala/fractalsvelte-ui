import type { Placement } from '../../../internal/tokens.js';

/** How the popover is opened. */
export type PopoverTrigger = 'click' | 'hover' | 'manual';

/** Enter class so the pop originates from the trigger side. */
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
