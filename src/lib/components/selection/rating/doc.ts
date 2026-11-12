import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Rating',
	summary: 'A star rating the person can set, with half values, a custom icon and a hover preview.',
	description: `Rating presents a row of icons — stars by default — that fills up to the current value. Hovering previews a new value; clicking (or the arrow keys) sets it. The filled portion of a half-selected icon is clipped, and the chosen icon springs as it lands.

It follows radio-group semantics, so a rating is one tab stop and the arrows move the value. Mark it \`readonly\` to show a score that cannot be changed, or pass any Lucide icon in place of the star.`,
	features: [
		'Bindable value, optional halves, and a hover preview',
		'Any icon, five sizes, readonly and disabled states',
		'Spring pop on the icon that was just chosen',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The control is a radiogroup; each increment is a radio with an accessible name of the form "Rating: 4 of 5".',
		'readonly sets aria-readonly and removes the radios, leaving a static representation of the score.',
		'disabled sets aria-disabled on the group and blocks interaction.',
		'Pass label to name the group; attributes spread onto the radiogroup.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Up', action: 'Raises the rating by one step (or a half, when allowed).' },
		{ keys: 'Arrow Left / Arrow Down', action: 'Lowers the rating by one step.' },
		{ keys: 'Home / End', action: 'Sets the lowest or highest rating.' },
		{ keys: 'Enter / Space', action: 'Sets the rating to the focused radio.' }
	],
	related: ['slider', 'radio-group']
});
