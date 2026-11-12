import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Tag',
	summary: 'A token that labels, filters or links, with an optional remove control.',
	description: `A tag is a small token: a topic, a filter, a selected value. It is a span carrying the fractalstyler \`.tag\` class and the shared variant, size and shape classes, so it matches the badges and buttons beside it.

Set \`removable\` to add a remove control. The tag never removes itself: \`onRemove\` tells the owner, which takes the value out of its own list. Set \`href\` to render the tag as a link instead; a link cannot contain a button, so the remove control is hidden in that case.`,
	features: [
		'Eleven variants, three sizes and five shapes on the shared axes',
		'Optional leading icon from @fractaldesign/icons',
		'Removable: an owner-controlled remove control with an accessible name',
		'Renders a link when given href'
	],
	accessibility: [
		'Renders a span, or an a element when href is set, so the link role and focus come from the platform.',
		'The remove control is a native button with an aria-label (removeLabel, "Remove" by default) and a visible focus ring.',
		'The remove icon is decorative; the aria-label carries the meaning.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the remove control, then on to the next focusable element.' },
		{ keys: 'Enter / Space', action: 'Removes the tag by calling onRemove.' }
	]
});
