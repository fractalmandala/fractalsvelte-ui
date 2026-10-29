import { components } from '$lib/styler/doc/data/components.json';
export const prerender = true;

const CATEGORY_ORDER = ['actions', 'blocks', 'display', 'forms', 'layout', 'motion', 'navigation', 'overlays', 'typography'] as const;
const CATEGORY_LABEL: Record<string, string> = {
	actions: 'Actions',
	blocks: 'Blocks',
	display: 'Display',
	forms: 'Forms',
	motion: 'Motion',
	navigation: 'Navigation',
	overlays: 'Overlays',
	typography: 'Typography'
};

export function load() {
	const groups = CATEGORY_ORDER.map((category) => ({
		category,
		label: CATEGORY_LABEL[category],
		items: components
			// components.json categories are capitalised ("Actions")
			.filter((c) => c.category.toLowerCase() === category)
			// matches the [slug] route: /components/button
			.map((c) => ({ name: c.title, slug: `/components/${c.name.toLowerCase()}` }))
	}));


	return { groups };
}