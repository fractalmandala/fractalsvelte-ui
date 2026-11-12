import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'VisuallyHidden',
	summary: 'Content that only screen readers hear, with an optional reveal on focus.',
	description: `Some content is needed by assistive technology but has no place on screen: the name of an icon-only button, the unit in a figure, the context a heading implies. Wrap that content in VisuallyHidden and it is removed from the layout and the screen while staying in the accessibility tree.

With \`focusable\`, the content appears when something inside it receives keyboard focus. That is the pattern for a skip link: it stays out of sight until a keyboard user tabs to it, then shows itself in place.`,
	features: [
		'Hidden from sight, still read by screen readers',
		'Renders a span or a div, chosen by as',
		'Focusable reveal for skip links and other keyboard-only affordances'
	],
	accessibility: [
		'Content stays in the accessibility tree; only its visual presence is removed.',
		'With focusable, the content is shown only while a descendant has focus, so the reveal is driven by the focus the user already has.',
		'Place the focusable link or button inside the component. The wrapper itself is not focusable.'
	]
});
