import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'GlassPanel',
	summary: 'A frosted surface that builds on the library glass treatment, with blur, tint, border and rim.',
	description: `Glass panel is the library's \`.glass\` surface with a controllable frost. \`blur\` rewrites the shared \`--glass-blur\` token; \`tint\` mixes a little of the theme accent into the panel; \`border\` and \`rim\` add the ordinary hairline and the lit top edge.

Sit it over a photograph, an aurora, or a busy hero — the frost is a backdrop-filter, so whatever is behind it stays in view, just quieter.`,
	features: [
		'Builds on the shared .glass surface',
		'Small, medium or large frost',
		'Optional theme tint, hairline border and lit rim'
	],
	accessibility: [
		'The panel is a plain container. The content inside it is the accessible content.',
		'Frosted glass is a visual treatment only and does not change role or keyboard behaviour.'
	],
	related: ['spotlight-card', 'aurora', 'noise']
});
