import { error, redirect } from '@sveltejs/kit';
import {
	categoryFromSlug,
	categoryToSlug,
	componentBySlug,
	componentsByCategory
} from '#lib/docs/catalogue.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const category = categoryFromSlug(params.category);
	if (!category) {
		// Backwards-compatibility: if params.category is a component slug (e.g. /components/button),
		// redirect to /components/<category>/<slug>
		const comp = componentBySlug(params.category);
		if (comp) {
			redirect(307, `/components/${categoryToSlug(comp.category)}/${comp.slug}`);
		}
		error(404, 'Category not found');
	}

	const canonicalSlug = categoryToSlug(category);
	if (params.category !== canonicalSlug) {
		redirect(307, `/components/${canonicalSlug}`);
	}

	const categoryComponents = componentsByCategory(category);

	return {
		category,
		categorySlug: canonicalSlug,
		components: categoryComponents
	};
};
