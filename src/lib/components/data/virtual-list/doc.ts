import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'VirtualList',
	summary: 'A windowed list that keeps 10,000+ rows scrolling smoothly, with an imperative scrollToIndex.',
	description: `\`VirtualList\` renders only the rows that are on screen, plus a small overscan, so a log, a directory or a long inbox stays light. Positions travel as custom properties through \`vars()\` — the stage is as tall as every row, and each visible row is placed at its offset — so the stylesheet, not inline styles, owns the layout.

Pass a fixed \`itemHeight\` when every row is the same height, or an estimator function when they vary; rendered rows are then measured and the offsets catch up. Call \`scrollToIndex\` on the component instance (via \`bind:this\`) to jump to a row, aligned to the start, centre or end of the viewport.`,
	features: [
		'Windowed rendering for tens of thousands of rows',
		'Fixed heights or an estimator with measurement',
		'Offsets through custom properties, never inline styles',
		'scrollToIndex on the component instance'
	],
	accessibility: [
		'The viewport is a role="list" with an accessible name from label, and is keyboard-scrollable when labelled.',
		'Each visible row is a role="listitem" with aria-setsize and aria-posinset so assistive technology can report position in the full list, not just the window.',
		'Only the visible window is in the DOM; aria-setsize still reflects the full item count.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Focuses the labelled viewport, then any controls inside a visible row.' },
		{ keys: 'Arrow keys / Page Up / Page Down / Home / End', action: 'Scroll the focused viewport.' }
	],
	api: [
		{
			name: 'scrollToIndex(index, options?)',
			type: '(index: number, options?: { align?: \'start\' | \'center\' | \'end\' }) => void',
			description: 'Scrolls the list so the item at index is aligned to the start, centre or end of the viewport. Honours reduced motion.'
		}
	],
	related: ['data-table', 'tree']
});
