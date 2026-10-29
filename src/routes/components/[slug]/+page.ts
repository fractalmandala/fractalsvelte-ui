// One route for every lib/styler component. The slug is the component name in
// lowercase; everything on the page comes from the generated data, so no
// component needs a hand-written doc file.
import { error } from '@sveltejs/kit';
import list from '$lib/styler/doc/data/components.json';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = list.components.find((c) => c.name.toLowerCase() === params.slug);
	if (!entry) error(404, `No styler component called "${params.slug}"`);
	return { entry };
};
