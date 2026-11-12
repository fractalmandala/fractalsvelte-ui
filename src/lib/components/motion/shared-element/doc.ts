import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SharedElement',
	summary: 'Gives an element a view-transition identity so it can morph between routes or in-page states.',
	description: `\`SharedElement\` writes a view-transition name onto its element (\`vtName()\` plus the \`.vt-name\` class). Two elements that use the same \`name\` — a grid card on one view, a detail hero on the next — morph from one box to the other when a view transition runs.

For in-page state changes (a card expanding in place, a grid becoming a detail) call the exported \`morph(update, options)\` helper, which wraps \`startViewTransition\`. On browsers without the API, or under reduced motion, \`update\` is applied directly and the change is instant.`,
	features: [
		'View-transition identity via vtName() and .vt-name',
		'Works across routes and in-page state changes',
		'morph() helper wrapping startViewTransition',
		'Renders as any tag'
	],
	accessibility: [
		'The component does not change the accessibility tree: it is the same element with a view-transition name. Keep headings, labels and focus management in the content you render.',
		'prefers-reduced-motion makes morph() apply the state change without a transition, so the new view is shown immediately.',
		'After an in-page morph, move focus to the new view when it is a dialog or a detail pane, so keyboard users are not left on a control that has been replaced.'
	],
	api: [
		{
			name: 'morph(update, options?)',
			type: '(update: () => void | Promise<void>, options?: MorphOptions) => Promise<void>',
			description:
				'Runs update inside startViewTransition so shared elements morph. options.type defaults to fade; options.origin is used by the reveal wipe. Falls back to calling update directly when view transitions are unavailable or reduced motion is on.'
		}
	],
	related: ['page-transition', 'animated-list']
});
