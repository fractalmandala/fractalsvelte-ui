import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Tree',
	summary: 'A hierarchical tree view with keyboard navigation, lazy children and optional checkboxes.',
	description: `\`Tree\` renders a nested set of items as a WAI-ARIA tree: each node can carry an icon, children and a disabled flag. Expanded and selected ids are bindable; set \`multiple\` for a multi-select tree, or \`checkable\` for a tri-state checkbox that propagates down to descendants and up to parents.

Children can be loaded lazily the first time a node is opened. Expanding and collapsing is a spring on fractalstyler's \`.collapse\`, with a quarter-turn caret. Keyboard navigation follows the tree pattern: arrows move, expand and collapse, Home and End jump, typeahead finds a label, and \`*\` expands every sibling of the focused node.`,
	features: [
		'WAI-ARIA tree pattern with typeahead and asterisk-to-expand-siblings',
		'Bindable expansion and selection, single or multiple',
		'Optional tri-state checkboxes with parent–child propagation',
		'Lazy loadChildren when a node is first opened',
		'Spring height and a quarter-turn caret'
	],
	accessibility: [
		'The root has role="tree" and an accessible name via label. Nodes are role="treeitem" with aria-level, aria-selected and aria-expanded.',
		'Disabled nodes expose aria-disabled and are skipped by keyboard movement.',
		'When checkable, each node exposes aria-checked (true, false or mixed) and a labelled checkbox.',
		'The expand control on a parent is a labelled button. While children are loading, the node is aria-busy.'
	],
	keyboard: [
		{ keys: 'Arrow Up / Down', action: 'Moves focus to the previous or next visible node.' },
		{ keys: 'Arrow Right', action: 'Expands a collapsed parent, or moves to its first child if already open.' },
		{ keys: 'Arrow Left', action: 'Collapses an expanded parent, or moves to the parent of a leaf or collapsed node.' },
		{ keys: 'Home / End', action: 'Moves focus to the first or last visible node.' },
		{ keys: 'Enter', action: 'Toggles a parent, or selects a leaf.' },
		{ keys: 'Space', action: 'Selects the node, or toggles its checkbox when checkable.' },
		{ keys: '*', action: 'Expands every expandable sibling of the focused node.' },
		{ keys: 'Typeahead', action: 'Focuses the next visible node whose label starts with the keys typed.' }
	],
	related: ['accordion', 'data-table', 'virtual-list']
});
