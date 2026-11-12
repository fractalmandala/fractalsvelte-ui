import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Popover',
	summary: 'An anchored non-modal panel on the Popover API, placed with CSS anchor positioning.',
	description: `The panel is a native popover — top layer, no portal, no z-index. CSS anchor positioning places it against the trigger, and \`.pop\` springs it in from the trigger's side.

\`trigger="click"\` toggles the panel and light-dismisses it (a click outside or Esc). \`trigger="hover"\` opens on hover or focus and stays open while the pointer travels to the panel. \`trigger="manual"\` is driven only by binding \`open\`.

The opener is the \`target\` snippet — \`trigger\` is the open mode. Spread \`props\` onto your own button. An arrow is not offered: CSS anchor positioning has no clean way to draw one from registered classes.`,
	features: [
		'Native Popover API: top layer, light dismiss, no portal',
		'Eight placements with CSS anchor positioning and flip fallbacks',
		'Click, hover or manual opening',
		'Optional match-width and a configurable offset',
		'Focus moves into the panel on click and returns to the trigger on close'
	],
	accessibility: [
		'A click popover has role="dialog". The trigger carries aria-haspopup="dialog", aria-expanded and aria-controls.',
		'On click open, focus moves to the panel; on close, it returns to the trigger.',
		'Esc and a click outside dismiss a click popover (popover="auto").',
		'A hover popover does not move focus and is dismissed when hover or focus leaves the trigger and the panel.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'On the trigger, toggles a click popover.' },
		{ keys: 'Esc', action: 'Closes a click popover and returns focus to the trigger.' },
		{ keys: 'Tab', action: 'Moves focus into the panel when it is open, or on to the next control when it is not.' }
	],
	related: ['tooltip', 'hover-card', 'dropdown-menu', 'dialog']
});
