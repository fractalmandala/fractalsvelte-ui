// Live dynamic route for every component in lib/components.
// The slug is the component name in lowercase; metadata is derived live via import.meta.glob.
import { error } from '@sveltejs/kit';
import { liveComponents } from '$site/doc/live-components';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return liveComponents.map((c) => ({ slug: c.name.toLowerCase() }));
};

export const load: PageLoad = ({ params }) => {
	const entry = liveComponents.find((c) => c.name.toLowerCase() === params.slug);
	if (!entry) error(404, `No component called "${params.slug}"`);
	return { entry };
};
