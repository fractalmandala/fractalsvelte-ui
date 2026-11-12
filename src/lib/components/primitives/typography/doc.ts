import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Typography',
	summary: 'Thin wrappers around fractalstyler\'s type scale: headings, lead and muted text, quotes, lists and inline code.',
	description: `These components do not invent a type scale. Each one applies classes that already exist in fractalstyler — \`page-title\` and the page-heading rungs for headings, \`page-desc\` for lead text, \`text-muted\` for secondary copy — so typography in an app matches typography everywhere else.

Wrap a page in \`Typography\` to get the reading measure. Use \`Heading\`, \`Text\`, \`Blockquote\`, \`List\` and \`InlineCode\` inside it, or on their own.`,
	parts: {
		Heading: 'A page heading at level 1 to 4; size sets the visual scale independently of the semantic level.',
		Text: 'Body, lead, muted, large or small text, rendered as a p, span, div or similar via as.',
		Blockquote: 'A quoted passage with a leading hairline.',
		List: 'A bulleted or numbered list, with markers the platform reset would otherwise hide.',
		InlineCode: 'A short code snippet in running text.'
	},
	features: [
		'Reading measure, centred or pinned to the start edge',
		'Four heading levels, with visual size independent of the semantic level',
		'Lead, muted, large and small text roles, with an as prop for the element',
		'Blockquote, lists and inline code'
	],
	accessibility: [
		'Heading renders a real <h1>–<h4> from level; size changes only the visual scale.',
		'Blockquote is a native <blockquote>. List renders a native <ul> or <ol>, and InlineCode renders a native <code>.'
	],
	related: ['badge']
});
