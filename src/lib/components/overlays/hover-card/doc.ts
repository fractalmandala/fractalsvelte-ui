import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'HoverCard',
	summary: 'A rich preview card on hover or focus of a link, with time to travel from the trigger to the card.',
	description: `A hover card is a non-modal popover that opens when a person hovers or focuses a link, and stays open while they move the pointer onto the card itself. \`closeDelay\` is the window for that journey; \`openDelay\` keeps accidental passes from flashing the preview.

The card is a native \`popover="manual"\` panel, placed with CSS anchor positioning and sprung in from the trigger's side. It does not steal focus.`,
	features: [
		'Opens on hover or focus, with configurable delays',
		'Safe pointer travel from the trigger onto the card',
		'Eight placements with CSS anchor positioning',
		'Glass or solid surface'
	],
	accessibility: [
		'The card has role="dialog". The trigger carries aria-expanded and aria-controls.',
		'The card does not take focus; keyboard users open it by focusing the trigger.',
		'Moving focus or the pointer away from both the trigger and the card closes it after closeDelay.'
	],
	keyboard: [
		{ keys: 'Focus', action: 'Opens the card after the open delay.' },
		{ keys: 'Tab', action: 'Leaves the trigger and closes the card after the close delay.' }
	],
	related: ['tooltip', 'popover']
});
