import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ColorPicker',
	summary: 'A saturation-brightness area, hue slider and optional alpha slider for picking a CSS colour, in hex, rgb or oklch.',
	description: `The colour picker works in HSV internally — a 2D area for saturation and brightness, a hue slider, and an optional alpha slider — and writes a CSS colour string in the chosen format. Thumb positions travel through custom properties, and the area and sliders are fully keyboard-operable.

Swatches give a short palette of brand or theme colours. When the browser supports the EyeDropper API, a pipette appears so the person can sample a colour from the screen.`,
	features: [
		'HSV area and hue slider, with optional alpha',
		'hex, rgb and oklch output, and a parsed text field',
		'Swatches and an EyeDropper control when the API exists',
		'Pointer capture and keyboard on every thumb',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The saturation-brightness area, the hue slider and the alpha slider are sliders with aria-valuemin/max/now and a spoken aria-valuetext.',
		'The text field is a labelled input that accepts any supported CSS colour.',
		'Swatches are a list of pressable colours, with aria-pressed on the current one.',
		'The pipette is labelled "Pick a colour from the screen" and is omitted when EyeDropper is unavailable.',
		'Pass label to prefix the accessible names of the area and sliders.'
	],
	keyboard: [
		{ keys: 'Arrow keys on the area', action: 'Adjust saturation (left/right) and brightness (up/down). Hold Shift for a larger step.' },
		{ keys: 'Arrow keys on hue or alpha', action: 'Move the slider. Home and End jump to the ends.' },
		{ keys: 'Enter in the text field', action: 'Parses the typed CSS colour and applies it.' }
	],
	related: ['select']
});
