import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SidebarNav',
	summary: 'A vertical navigation tree with groups, badges and an icon-only rail that springs to width.',
	description: `A sidebar is the durable navigation of an application: groups of links, with icons and optional badges, and a rail that can collapse to icons only. The collapsed width springs through the shared CSS spring, and each icon reveals its label on hover. Groups use fractalstyler's \`.collapse\` and \`.caret\`, and stay open when they contain the current page.

Pass \`current\` as the active href — the library does not talk to a router. Separators can break a long list into sections.`,
	features: [
		'Nested groups, with a spring-open collapse and a turning caret',
		'Icons, badges and separators',
		'Bindable collapsed rail, with hover labels when icon-only',
		'aria-current on the active link'
	],
	accessibility: [
		'Rendered as a navigation landmark, labelled by the label prop (default “Sidebar”).',
		'The current link is marked with aria-current="page".',
		'Groups are buttons with aria-expanded; their panels are hidden with the collapse pattern when shut.',
		'When the rail is collapsed, labels are exposed as hover hints and as the link title.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through links and group buttons.' },
		{ keys: 'Enter / Space', action: 'Follows a focused link, or opens or closes a focused group.' }
	],
	related: ['navbar', 'toc', 'dock', 'accordion']
});
