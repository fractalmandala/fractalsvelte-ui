import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Button',
	summary: 'Triggers an action or navigates, with a spring-loaded press.',
	description: `The button is the library's reference component: eleven variants, five sizes and five shapes, all of them plain fractalstyler classes, so a button always matches the inputs, tags and cards around it.

It renders a native \`<button>\` — or an \`<a>\` when you pass \`href\` — and forwards every attribute and event to it. Pressing it drives a real spring through the motion channel rather than a CSS keyframe, so a quick tap and a long hold both feel right.`,
	features: [
		'Eleven variants, five sizes, five shapes — shared with every other control',
		'Leading and trailing icons from @fractaldesign/icons, plus leading and trailing snippets',
		'Loading state that keeps the layout stable',
		'Renders a link when given href; a disabled link stays an anchor with aria-disabled',
		'Interruptible spring press, disabled under reduced motion'
	],
	accessibility: [
		'Renders a native <button>, or an <a> when href is set. A disabled or loading link keeps the <a>, drops href, and sets aria-disabled and tabindex="-1".',
		'While loading, the button is disabled and exposes aria-busy="true".',
		'An icon-only button needs an aria-label; icons are decorative and hidden from assistive technology.',
		'The focus ring is drawn only for keyboard focus (:focus-visible).'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Activates the button.' },
		{ keys: 'Tab', action: 'Moves focus to the next focusable element.' }
	]
});
