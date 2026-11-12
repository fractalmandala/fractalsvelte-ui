import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'AvatarGroup',
	summary: 'An overlapped stack of avatars, with a "+N" overflow and a spring that spreads the stack on hover.',
	description: `A group sits its members in a tight overlapping row, each ringed so they stay distinct against the surface behind them. When there are more people than \`max\`, the rest collapse into a "+N" tile.

On hover the stack springs apart just enough to let each portrait breathe, then settles back. The group's \`size\` and \`shape\` are inherited by every member.`,
	features: [
		'Overlapped row with a surface-coloured ring',
		'max collapses the tail into a "+N" tile',
		'Spread-on-hover spring, disabled under reduced motion',
		'Shared size and shape for every member'
	],
	accessibility: [
		'Each member is an avatar with its own accessible name.',
		'The overflow tile is labelled "+N more", so the hidden count is announced.',
		'The group itself is not interactive; the spread is a visual hover effect only.'
	],
	related: ['avatar']
});
