import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Banner',
	summary: 'A full-width announcement for the page or the site, optionally pinned and remembered when dismissed.',
	description: `A banner sits at the edge of the page — a release note, a billing reminder, a status change — and stretches the full width of its container. It shares the five tones of the rest of the status vocabulary.

When \`sticky\` is set, the banner pins to the top of the scrollport as the page moves. A dismissible banner can be given a \`storageKey\`: the dismissal is written to \`localStorage\`, so the same announcement does not come back on the next visit.`,
	features: [
		'Five tones, shared with Alert and the rest of the status vocabulary',
		'Optionally sticky at the top of the scrollport',
		'Dismissal can be remembered across visits with a storage key',
		'An action link for the next step'
	],
	accessibility: [
		'Danger and warning banners use role="alert", so assistive technology announces them immediately.',
		'Other banners use role="region" with the accessible name "Announcement", so they can be found by landmark navigation without interrupting the reader.',
		'Pass your own role to override the default.',
		'Icons are decorative and hidden from assistive technology; the title and message carry the meaning.',
		'The dismiss button is a native button labelled "Dismiss" with a visible keyboard focus ring.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the action link and the dismiss button.' },
		{ keys: 'Enter / Space', action: 'Follows the action link, or dismisses the banner when the dismiss button is focused.' }
	],
	related: ['alert', 'toast']
});
