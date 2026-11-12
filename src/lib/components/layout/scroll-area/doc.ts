import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ScrollArea',
	summary: 'A keyboard-focusable scroll region with thin themed scrollbars and edge fades that appear only when there is more to scroll.',
	description: `ScrollArea is a labelled region that scrolls on one axis or both. Its height can be capped with the measure ladder (xs to 2xl). Scrollbars are thin and themed, and can stay visible, appear on hover and keyboard focus, or be hidden.

Edge fades are scroll-driven: a mask opens at each overflowing edge and closes when that edge is reached, so the fade is never painted over content that is already fully in view. The region is in the tab order and can be scrolled with the keys the platform already provides.`,
	features: [
		'Vertical, horizontal, or both axes',
		'Height cap from the measure ladder',
		'Thin, hover-only, or hidden scrollbars',
		'Edge fades that follow scroll position',
		'Keyboard-focusable labelled region'
	],
	accessibility: [
		'Renders a role="region" with an accessible name from label, and is in the tab order so it can be focused and scrolled from the keyboard.',
		'The focus ring is drawn only for keyboard focus (:focus-visible).',
		'Hiding the scrollbar does not remove scrolling; the region still scrolls from the keyboard, the trackpad and the mouse wheel.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Focuses the region, then the next focusable control inside or after it.' },
		{
			keys: 'Arrow keys / Page Up / Page Down / Home / End / Space',
			action: 'Scroll the focused region, as the platform would on any overflow container.'
		}
	],
	related: ['sticky-bar', 'virtual-list', 'resizable']
});
