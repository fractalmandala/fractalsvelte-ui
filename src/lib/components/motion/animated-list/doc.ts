import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'AnimatedList',
	summary: 'A list whose items spring in, out and into their new positions as the data changes.',
	description: `\`AnimatedList\` is built for a notifications feed: items enter and leave with \`springFly\`, and the survivors are FLIPped with \`createFlip()\` so they spring from their old box to their new one. Each item needs a stable \`key\`; that value is also the \`data-flip-id\`. Exiting items are taken out of flow with the \`.leaving\` class (their last box is written to \`--ox\`, \`--oy\`, \`--ow\`) so the rest of the list can settle without a jump.

\`max\` caps how many items stay visible. With \`reverse\`, the list is shown newest first and \`max\` keeps the last items in the source array.`,
	features: [
		'Generic items with a key accessor',
		'Spring enter and exit',
		'FLIP for items that stay',
		'Optional max length',
		'Optional reverse (newest first)'
	],
	accessibility: [
		'The root is a list and each child is a listitem, so assistive technology announces additions and removals as list changes rather than as a custom tree.',
		'prefers-reduced-motion makes the spring transitions collapse to a short fade and skips FLIP, so items appear and disappear in place.',
		'If an item contains a control (dismiss, open), keep that control labelled; the list itself does not steal focus when items move.'
	],
	related: ['marquee', 'shared-element', 'reorder']
});
