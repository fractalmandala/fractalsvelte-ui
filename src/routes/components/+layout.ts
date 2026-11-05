import { components } from '$site/doc/data/components.json';
export const prerender = true;

const CATEGORY_ORDER = [
	'actions',
	'blocks',
	'display',
	'forms',
	'layout',
	'navigation',
	'overlays',
	'typography'
] as const;

const CATEGORY_LABEL: Record<string, string> = {
	actions: 'Actions',
	blocks: 'Blocks',
	display: 'Display',
	forms: 'Forms',
	layout: 'Layout',
	navigation: 'Navigation',
	overlays: 'Overlays',
	typography: 'Typography'
};

export function load() {
	const groups = CATEGORY_ORDER.map((category) => ({
		category,
		label: CATEGORY_LABEL[category],
		items: components
			.filter((c) => c.category?.toLowerCase() === category)
			.map((c) => ({
				name: c.title,
				description: c.description,
				slug: `/components/${c.name.toLowerCase()}`
			}))
	})).filter((g) => g.items.length > 0);

	return { groups };
}
