import manifest from '$lib/documentation/manifest.styler.json';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const component = manifest.components.find(
		(c) => c.name.toLowerCase() === params.name.toLowerCase()
	);

	if (!component) {
		throw error(404, `Component "${params.name}" not found`);
	}

	return {
		component,
		allComponents: manifest.components.map((c) => ({
			name: c.name,
			category: c.category
		}))
	};
};
