/**
 * The docs registry: every component folder, discovered with import.meta.glob.
 * doc.ts manifests are eager (small); example components and their sources are
 * lazy, loaded per page. Works with zero components and with hundreds.
 */
import type { Component } from 'svelte';
import type { ComponentDoc } from '../lib/docs/define.js';
import type { ApiComponent, ApiJson, LayerClass } from '../lib/docs/api-types.js';
import { kits, type Kit } from '../lib/components/kits.js';

const docModules = import.meta.glob<ComponentDoc>('../lib/components/*/*/doc.ts', { eager: true, import: 'default' });
const exampleModules = import.meta.glob<Component>('../lib/components/*/*/examples/*.svelte', { import: 'default' });
const exampleSources = import.meta.glob<string>('../lib/components/*/*/examples/*.svelte', { query: '?raw', import: 'default' });
const apiModules = import.meta.glob<ApiJson>('../lib/docs/generated/api.json', { eager: true, import: 'default' });
const classModules = import.meta.glob<LayerClass[]>('../lib/docs/generated/classes.json', { eager: true, import: 'default' });

export const PACKAGE = '@fractaldesign/fractalsvelte-ui';

export interface ExampleRef {
	file: string;
	title: string;
	description: string;
	key: string;
}

export interface Entry {
	kit: string;
	slug: string;
	name: string;
	href: string;
	summary: string;
	doc: ComponentDoc | null;
	api: ApiComponent | null;
	examples: ExampleRef[];
}

export interface KitGroup {
	kit: Kit;
	components: Entry[];
}

export interface LoadedExample extends ExampleRef {
	source: string;
	component: Component | null;
	error: string | null;
}

const base = (kit: string, slug: string) => `../lib/components/${kit}/${slug}`;

function parseKey(key: string): { kit: string; slug: string } | null {
	const m = key.match(/^\.\.\/lib\/components\/([^/]+)\/([^/]+)\//);
	return m ? { kit: m[1], slug: m[2] } : null;
}

function pascal(slug: string): string {
	return slug
		.split('-')
		.filter(Boolean)
		.map((p) => p[0].toUpperCase() + p.slice(1))
		.join('');
}

function build(): Entry[] {
	const api = Object.values(apiModules)[0]?.components ?? [];
	const ids = new Map<string, { kit: string; slug: string }>();
	for (const a of api) ids.set(`${a.kit}/${a.slug}`, { kit: a.kit, slug: a.slug });
	for (const key of Object.keys(docModules)) {
		const p = parseKey(key);
		if (p) ids.set(`${p.kit}/${p.slug}`, p);
	}
	const order = new Map(kits.map((k, i) => [k.id, i]));
	const entries: Entry[] = [];
	for (const { kit, slug } of ids.values()) {
		const doc = docModules[`${base(kit, slug)}/doc.ts`] ?? null;
		const apiEntry = api.find((a) => a.kit === kit && a.slug === slug) ?? null;
		const examples: ExampleRef[] = (apiEntry?.examples ?? [])
			.map((e) => ({ ...e, key: `${base(kit, slug)}/examples/${e.file}` }))
			.filter((e) => e.key in exampleModules);
		// examples that landed after the last `pnpm gen`
		for (const key of Object.keys(exampleModules)) {
			if (!key.startsWith(`${base(kit, slug)}/examples/`) || examples.some((e) => e.key === key)) continue;
			const file = key.slice(key.lastIndexOf('/') + 1);
			examples.push({ file, title: file.replace(/^\d+-/, '').replace(/\.svelte$/, '').replace(/-/g, ' '), description: '', key });
		}
		examples.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
		entries.push({
			kit,
			slug,
			name: doc?.name ?? apiEntry?.name ?? pascal(slug),
			href: `/components/${kit}/${slug}`,
			summary: doc?.summary ?? '',
			doc,
			api: apiEntry,
			examples
		});
	}
	return entries.sort((a, b) => {
		const ka = order.get(a.kit) ?? 1e6;
		const kb = order.get(b.kit) ?? 1e6;
		return ka - kb || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
	});
}

const all = build();

export function components(): Entry[] {
	return all;
}

/** Every kit (including empty ones), with its components. */
export function kitGroups(): KitGroup[] {
	return kits.map((kit) => ({ kit, components: all.filter((c) => c.kit === kit.id) }));
}

export function getComponent(kit: string, slug: string): Entry | undefined {
	return all.find((c) => c.kit === kit && c.slug === slug);
}

export function bySlug(slug: string): Entry | undefined {
	return all.find((c) => c.slug === slug);
}

export function neighbours(entry: Entry): { prev: Entry | null; next: Entry | null } {
	const i = all.indexOf(entry);
	return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null };
}

export async function loadExample(ex: ExampleRef): Promise<LoadedExample> {
	let source = '';
	let component: Component | null = null;
	let error: string | null = null;
	try {
		source = (await exampleSources[ex.key]?.()) ?? '';
	} catch (err) {
		error = (err as Error).message;
	}
	try {
		component = (await exampleModules[ex.key]?.()) ?? null;
	} catch (err) {
		error = (err as Error).message;
	}
	return { ...ex, source, component, error };
}

export function loadExamples(entry: Entry): Promise<LoadedExample[]> {
	return Promise.all(entry.examples.map(loadExample));
}

export function layerClasses(): LayerClass[] {
	return Object.values(classModules)[0] ?? [];
}

/** The example source without its `<!-- @example … -->` header line. */
export function displaySource(source: string): string {
	return source.replace(/^\s*<!--\s*@example[\s\S]*?-->\s*\n/, '').replace(/\s+$/, '') + '\n';
}
