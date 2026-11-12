import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'StickyBar',
	summary: 'A bar that sticks to the top or bottom of its scroll container and gains glass and elevation only while stuck.',
	description: `StickyBar is for toolbars and save bars. It sits in the document flow and sticks to the top or bottom of its nearest scroll container. A one-pixel sentinel and IntersectionObserver decide when it is stuck; only then does the bar take on glass, a lit rim and elevation.

The offset from the edge is a custom property. The bar is a pop surface (with an enter from the edge it sticks to) so it settles on the same spring tokens as the rest of the library. It does not hide when it is not stuck — a toolbar stays visible, and only its surface changes.`,
	features: [
		'Sticks to the top or bottom of the nearest scroll container',
		'Glass and elevation only while stuck, detected by a sentinel',
		'Configurable offset from the edge',
		'Enters as a pop surface from the stuck edge'
	],
	accessibility: [
		'The bar is a layout structure with no implicit role; put headings, navigation or actions inside it and label them.',
		'Sticking does not remove the bar from the tab order or change its contents.',
		'The sentinel is a decorative 1px probe and is ignored by assistive technology (empty, overflow hidden, not in the tab order).'
	],
	related: ['scroll-area', 'resizable']
});
