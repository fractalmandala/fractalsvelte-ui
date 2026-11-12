import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Resizable',
	summary: 'Split panes that resize by dragging or keyboard, with collapsible panes that spring open and shut.',
	description: `Resizable lays panes side by side or stacked and puts a draggable handle between each pair. Sizes are percentages that always total 100, so the layout survives any container size, and each pane can carry its own minimum, maximum and collapse rules.

Drag a handle with the pointer, move it with the arrow keys, double-click it to return to the default proportions, or press Enter to collapse a collapsible neighbour. Collapsing and expanding spring; dragging follows the pointer directly. \`sizes\` is bindable, \`onResize\` reports every change, and \`storageKey\` remembers the layout between visits.

Give the group a height — it fills its container, so a sized parent is all it needs.`,
	parts: {
		ResizablePane: 'One pane of the group, with its default, minimum, maximum and collapse sizes.',
		ResizableHandle: 'The draggable, focusable separator between two panes.'
	},
	features: [
		'Pointer drag with pointer capture — works with mouse, touch and pen',
		'Full keyboard resizing following the WAI-ARIA window splitter pattern',
		'Minimum, maximum and collapsible panes; collapsing springs',
		'Bindable sizes, an onResize callback, and optional localStorage persistence',
		'Double-click a handle to restore the default proportions',
		'Horizontal or vertical, nestable to any depth'
	],
	accessibility: [
		'Each handle is a focusable role="separator" with aria-orientation, aria-valuenow, aria-valuemin and aria-valuemax describing the pane before it, and aria-controls pointing at that pane.',
		'Give a handle a specific aria-label when a layout has several ("Resize sidebar"); the default is "Resize panels".',
		'A pane collapsed to zero becomes inert, so its content leaves the tab order.',
		'The focus ring is drawn only for keyboard focus (:focus-visible).'
	],
	keyboard: [
		{ keys: 'Arrow Left / Right', action: 'Moves a handle in a horizontal group by 5% (20% with Shift).' },
		{ keys: 'Arrow Up / Down', action: 'Moves a handle in a vertical group by 5% (20% with Shift).' },
		{ keys: 'Home / End', action: 'Moves the handle to the smallest or largest size of the pane before it.' },
		{ keys: 'Enter', action: 'Collapses or expands the collapsible pane next to the handle.' },
		{ keys: 'Tab', action: 'Moves focus to the next handle or control.' }
	],
	related: ['scroll-area', 'sticky-bar']
});
