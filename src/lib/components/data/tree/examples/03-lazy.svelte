<!-- @example Lazy children :: loadChildren is called the first time a folder with hasChildren is opened. -->
<script lang="ts">
	import { Tree, type TreeItem } from '@fractaldesign/fractalsvelte-ui';
	import { luFile, luFolder } from '@fractaldesign/icons/lucide';

	const catalog: Record<string, TreeItem[]> = {
		packages: [
			{ id: 'fractalsvelte-ui', label: 'fractalsvelte-ui', icon: luFolder, hasChildren: true },
			{ id: 'fractalstyler', label: 'fractalstyler', icon: luFolder, hasChildren: true },
			{ id: 'icons', label: 'icons', icon: luFolder, hasChildren: false }
		],
		'fractalsvelte-ui': [
			{ id: 'src-mui', label: 'src', icon: luFolder, hasChildren: true },
			{ id: 'pkg-mui', label: 'package.json', icon: luFile }
		],
		'fractalstyler': [
			{ id: 'src-fs', label: 'src', icon: luFile },
			{ id: 'registry', label: 'registry.md', icon: luFile }
		],
		'src-mui': [
			{ id: 'lib', label: 'lib', icon: luFolder, hasChildren: false },
			{ id: 'routes', label: 'routes', icon: luFolder, hasChildren: false }
		]
	};

	const items: TreeItem[] = [
		{ id: 'packages', label: 'packages', icon: luFolder, hasChildren: true },
		{ id: 'pnpm-ws', label: 'pnpm-workspace.yaml', icon: luFile }
	];

	function loadChildren(item: TreeItem): Promise<TreeItem[]> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(catalog[item.id] ?? []), 600);
		});
	}

	let expanded = $state(new Set<string>());
	let selected = $state<string | null>(null);
</script>

<Tree {items} bind:expanded bind:selected {loadChildren} label="Monorepo" />
