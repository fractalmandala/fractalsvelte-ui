import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Accordion',
	summary: 'A group of disclosures that open with a spring height, one or many at a time.',
	description: `\`Accordion\` is a WAI-ARIA accordion: each item is a heading that contains a button, controlling a region below it. The panel opens and closes with fractalstyler's \`.collapse\`, timed by the same spring tokens as the rest of the library, and a caret turns as it opens.

Use \`type="single"\` to keep one item open (and \`collapsible\` to allow it to close), or \`type="multiple"\` for several. Three variants set the grouping: \`separated\` cards, one \`contained\` panel, or a \`flush\` stack of hairlines. Reach for \`Collapsible\` when you only need a single disclosure.`,
	parts: {
		AccordionItem: 'One disclosure: a heading trigger and a spring-height panel, identified by value.'
	},
	features: [
		'Single or multiple open items, with an optional collapsible single item',
		'Three variants: separated, contained and flush',
		'Spring height and a turning caret',
		'Configurable heading level on the trigger'
	],
	accessibility: [
		'Each item is a heading (h2–h6, from headingLevel) containing a button with aria-expanded and aria-controls, pointing at a role="region" panel labelled by the button.',
		'A disabled item\'s button is disabled and cannot be opened.',
		'The accordion is one tab stop through its triggers, then arrow keys move between them.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Opens or closes the focused item.' },
		{ keys: 'Arrow Up / Down', action: 'Moves focus to the previous or next item trigger.' },
		{ keys: 'Home / End', action: 'Moves focus to the first or last item trigger.' },
		{ keys: 'Tab', action: 'Leaves the accordion for the next focusable element.' }
	],
	related: ['collapsible', 'tree']
});
