// One route for every lib/components component. The slug is the component name in
// lowercase; everything on the page comes from the generated data in src/site/doc/data.
import { error } from '@sveltejs/kit';
import list from '$site/doc/data/components.json';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = list.components.find((c) => c.name.toLowerCase() === params.slug);
	if (!entry) error(404, `No component called "${params.slug}"`);
	return { entry };
};
