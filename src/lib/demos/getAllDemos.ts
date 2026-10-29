import type { Component } from 'svelte';

export interface DemoItem {
	name: string;
	category: string;
	path: string;
	// Component loader
	load: () => Promise<{ default: Component }>;
}

export type DemosByCategory = Record<string, DemoItem[]>;

export function getDemos(): DemosByCategory {
	// Eager: false loads code on-demand per demo
	const modules = import.meta.glob('./*/*.svelte');
	const grouped: DemosByCategory = {};

	for (const path in modules) {
		// Path format: "./actions/Button.svelte"
		const segments = path.replace('./', '').split('/');
		if (segments.length === 2) {
			const [category, filename] = segments;
			const name = filename.replace('.svelte', '');

			if (!grouped[category]) {
				grouped[category] = [];
			}

			grouped[category].push({
				name,
				category,
				path,
				load: modules[path] as () => Promise<{ default: Component }>
			});
		}
	}

	return grouped;
}