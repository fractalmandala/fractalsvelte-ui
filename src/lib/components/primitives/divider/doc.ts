import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Divider',
	summary: 'A hairline rule that separates content, optionally labelled, horizontal or vertical.',
	description: `A divider is the quietest way to separate two blocks. An unlabelled horizontal divider is a native hr styled with a fractalstyler border class; it needs no markup beyond itself.

Pass children to a horizontal divider to centre a label in the rule, as in an "or" between two sign-in methods. A vertical divider sits inside a row and stretches to the row's height, which is how toolbars and button groups separate their sections.`,
	features: [
		'Horizontal or vertical orientation',
		'Four line styles: solid, dashed, subtle and strong',
		'Optional centred label on horizontal dividers',
		'Spacing from the shared size ladder'
	],
	accessibility: [
		'An unlabelled horizontal divider is an hr element, which assistive technology announces as a separator.',
		'A vertical divider has role="separator" with aria-orientation="vertical".',
		'A labelled horizontal divider is text between two rules: the rules are hidden from assistive technology and the label is read in place. An ARIA separator would hide its label, so it is not used there.'
	]
});
