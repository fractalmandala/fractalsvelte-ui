import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Badge',
	summary: 'A small status or count label on the shared variant and shape axes.',
	description: `A badge is a short, quiet label: a status, a count, a version. It is a plain span carrying the fractalstyler \`.badge\` class, so it sits on the same ladders as buttons and tags: the same variants, the same shapes, the same control heights.

Use the soft variant for most badges and keep the status variants for meaning. A leading dot marks live state, and an icon belongs before the label when it adds meaning the text does not carry.`,
	features: [
		'Eleven variants and five shapes, shared with every other control',
		'Three sizes on the control height ladder',
		'Optional leading dot for live or status state',
		'Optional leading icon from @fractaldesign/icons'
	],
	accessibility: [
		'Renders a span whose text is read in place, so the label reads naturally inside a sentence.',
		'The leading dot is decorative and hidden from assistive technology.',
		'Colour is never the only signal: pair a status variant with a word, as in "Failed" or "Verified".'
	]
});
