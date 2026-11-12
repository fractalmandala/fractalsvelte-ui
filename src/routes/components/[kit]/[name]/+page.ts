import { error } from '@sveltejs/kit';
import { components, getComponent, loadExamples, neighbours } from '../../../../docs-site/registry.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => components().map((c) => ({ kit: c.kit, name: c.slug }));

export const load: PageLoad = async ({ params }) => {
	const entry = getComponent(params.kit, params.name);
	if (!entry) error(404, `No component ${params.kit}/${params.name}`);
	const examples = await loadExamples(entry);
	return { entry, examples, ...neighbours(entry) };
};
