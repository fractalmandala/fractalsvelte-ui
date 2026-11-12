import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Motion',
	summary: 'A declarative spring element: states layer and animate() springs between them.',
	description: `Motion is the component face of the library's spring engine. You describe states as motion values — \`initial\`, \`animate\`, \`whileHover\`, \`whilePress\`, \`whileFocus\`, \`whileInView\` — and the element resolves them to a single target, then calls \`animate()\`. Changing a prop mid-flight is interruptible and keeps the current velocity.

Exit is left to Presence. Combining a CSS \`out:\` transition with the \`.motion\` channels is not clean — the transition writes \`transform\` while the engine owns \`translate\` / \`scale\` / \`opacity\` — so unmounting with a spring belongs on \`<Presence>\`.`,
	features: [
		'State layering resolves to one target and calls animate()',
		'Interruptible, velocity-preserving springs',
		'Hover, press, focus and in-view states',
		'Polymorphic as prop',
		'Reduced-motion safe (the engine jumps to the target)'
	],
	accessibility: [
		'Renders the element given by as (a div by default) and forwards every attribute and event to it.',
		'whilePress also responds to Enter and Space when the element is focusable. Pass a native button, or a tabindex, when you use that state.',
		'whileFocus follows focusin/focusout, including focus inside the element.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Applies whilePress while the key is held, when that state is set and the element is focused.' }
	],
	related: ['presence', 'reveal', 'magnetic']
});
