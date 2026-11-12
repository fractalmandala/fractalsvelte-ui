import type { Placement } from '../../../internal/tokens.js';

/** Enter class so the card originates from the trigger side. */
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
