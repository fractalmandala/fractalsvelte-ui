import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ButtonGroup',
	summary: 'Joins related buttons into one segmented control, or spaces them evenly.',
	description: `A button group is layout, not behaviour: it lines its children up on one axis and, when \`attached\`, squares the inner corners and overlaps the hairlines so the buttons read as a single control. Each child keeps its own variant, size and handlers.

Give the group a \`label\` so assistive technology announces what the buttons have in common. For single or multiple selection, reach for \`ToggleGroup\` instead.`,
	features: [
		'Attached (segmented) or spaced layout',
		'Horizontal or vertical',
		'Hovered and focused buttons rise above their neighbours so rings are never clipped',
		'Works with Button, IconButton and SplitButton children'
	],
	accessibility: [
		'Renders role="group"; pass label to name it.',
		'Every child remains an independent tab stop.'
	],
	related: ['button', 'toggle-group', 'split-button']
});
