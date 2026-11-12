import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'BackToTop',
	summary: 'A floating button that appears after a scroll threshold, with a scroll-progress ring around it.',
	description: `Back to top is a quiet way home on a long page. It stays hidden until the person has scrolled past \`threshold\`, then arrives with a \`.pop\` transition. A \`.ring\` around the button fills with the page's scroll progress, written by the \`scrollProgress()\` attachment as \`--value\`.

The button scrolls to the top of the page smoothly, unless the person prefers reduced motion.`,
	features: [
		'Appears after a configurable threshold, with a pop transition',
		'A scroll-progress ring driven by scrollProgress() writing --value',
		'Five sizes, honouring reduced motion'
	],
	accessibility: [
		'Rendered as a button with an accessible name (default “Back to top”).',
		'While hidden, the button is inert to the pointer and is removed from the tab order, and marked aria-hidden.',
		'The progress ring is decorative and hidden from the accessibility tree.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Reaches the button once it is visible.' },
		{ keys: 'Enter / Space', action: 'Scrolls to the top of the page.' }
	],
	related: ['toc', 'pagination', 'icon-button']
});
