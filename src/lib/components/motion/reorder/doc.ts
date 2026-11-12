import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Reorder',
	summary: 'A drag-to-reorder list whose siblings make room with FLIP springs.',
	description: `Reorder is a generic list. Bind \`items\`, pass a \`key\` accessor, and render each row with the \`children\` snippet — it receives the item and \`{ dragging, handleProps }\`. Pointer drags lift the row (scale and shadow) while \`createFlip()\` springs the others aside. Keyboard users lift with Space, move with the arrows, drop with Space, and cancel with Escape.

Announcements go through a live region, following the WAI-ARIA drag-and-drop list pattern.`,
	features: [
		'FLIP springs via createFlip()',
		'Pointer drag with a lifted item',
		'Keyboard reordering with live-region announcements',
		'Bindable items and an onReorder callback',
		'Horizontal or vertical axis'
	],
	accessibility: [
		'The list is a listbox with aria-roledescription="sortable list". Each row is an option with aria-grabbed and aria-selected.',
		'A visually hidden description explains the keyboard, and an assertive live region announces grabs, moves, drops and cancellations.',
		'Roving tabindex keeps a single tab stop in the list. Focus is restored to the moved item after a keyboard reorder.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus into or out of the list.' },
		{ keys: 'Arrow keys', action: 'Moves focus between items, or moves a lifted item along the list axis.' },
		{ keys: 'Space / Enter', action: 'Lifts the focused item, or drops it if it is already lifted.' },
		{ keys: 'Escape', action: 'Cancels a lift and restores the original order.' }
	],
	related: ['draggable', 'motion']
});
