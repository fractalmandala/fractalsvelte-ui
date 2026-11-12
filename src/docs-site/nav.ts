/** The hand-written guides, in reading order. */
export interface Guide {
	slug: string;
	href: string;
	title: string;
	summary: string;
}

export const guides: Guide[] = [
	{ slug: '', href: '/docs', title: 'Introduction', summary: 'What fractalsvelte-ui is, and the two laws it is built on.' },
	{ slug: 'installation', href: '/docs/installation', title: 'Installation', summary: 'Install, import the styles, set the mode and theme, render a component.' },
	{ slug: 'styling', href: '/docs/styling', title: 'Styling', summary: 'Law 1: fractalstyler classes, the extension layer, the custom-property channel.' },
	{ slug: 'theming', href: '/docs/theming', title: 'Theming', summary: 'One recipe, three numbers: hue, chroma and tint — plus radius, density and motion.' },
	{ slug: 'motion', href: '/docs/motion', title: 'Motion', summary: 'Spring presets, the JS spring engine, attachments, transitions and CSS spring tokens.' },
	{ slug: 'view-transitions', href: '/docs/view-transitions', title: 'View transitions', summary: 'Typed page and state transitions on the View Transitions API.' },
	{ slug: 'contributing', href: '/docs/contributing', title: 'Contributing', summary: 'Law 2: a component and its documentation are one folder. The commands.' }
];

export const headerLinks = [
	{ href: '/docs', label: 'Docs', match: (p: string) => p.startsWith('/docs') && !p.startsWith('/docs/motion') && !p.startsWith('/docs/theming') },
	{ href: '/components', label: 'Components', match: (p: string) => p.startsWith('/components') },
	{ href: '/docs/motion', label: 'Motion', match: (p: string) => p.startsWith('/docs/motion') },
	{ href: '/docs/theming', label: 'Themes', match: (p: string) => p.startsWith('/docs/theming') }
];
