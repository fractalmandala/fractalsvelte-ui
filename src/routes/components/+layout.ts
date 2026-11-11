import { liveComponents } from '$site/doc/live-components';
export const prerender = true;

// Groups are the folders of src/lib/components, in the order they read best.
const CATEGORY_ORDER = [
	'core',
	'actions',
	'forms',
	'display',
	'layout',
	'navigation',
	'overlays',
	'typography',
	'blocks'
] as const;

const CATEGORY_LABEL: Record<string, string> = {
	core: 'Core',
	actions: 'Actions',
	forms: 'Forms',
	display: 'Display',
	layout: 'Layout',
	navigation: 'Navigation',
	overlays: 'Overlays',
	typography: 'Typography',
	blocks: 'Blocks'
};

export function load() {
	const groups = CATEGORY_ORDER.map((category) => ({
		category,
		label: CATEGORY_LABEL[category],
		items: liveComponents
			.filter((c) => c.category === category)
			.map((c) => ({
				name: c.title,
				description: c.description,
				slug: `/components/${c.name.toLowerCase()}`
			}))
	})).filter((g) => g.items.length > 0);

	return { groups };
}
