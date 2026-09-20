import { error, redirect } from '@sveltejs/kit';
import { categoryToSlug, componentBySlug } from '#lib/docs/catalogue.ts';
import { highlightCode } from '#lib/docs/shiki.server.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const component = componentBySlug(params.slug);
	if (!component) error(404, 'Component not found');

	const expectedCategorySlug = categoryToSlug(component.category);
	if (params.category.toLowerCase() !== expectedCategorySlug) {
		redirect(307, `/components/${expectedCategorySlug}/${component.slug}`);
	}

	return {
		component,
		category: component.category,
		categorySlug: expectedCategorySlug,
		usageHtml: await highlightCode(component.usage, 'svelte')
	};
};
