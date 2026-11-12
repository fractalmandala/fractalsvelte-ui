<!-- @example Usage :: A repository tree with folder icons, bindable expansion and a selected file. -->
<script lang="ts">
	import { Tree, type TreeItem } from '@fractaldesign/fractalsvelte-ui';
	import { luFile, luFolder } from '@fractaldesign/icons/lucide';

	const items: TreeItem[] = [
		{
			id: 'src',
			label: 'src',
			icon: luFolder,
			children: [
				{
					id: 'src-lib',
					label: 'lib',
					icon: luFolder,
					children: [
						{ id: 'tree-ts', label: 'tree.ts', icon: luFile },
						{ id: 'table-ts', label: 'table-state.ts', icon: luFile },
						{ id: 'index-ts', label: 'index.ts', icon: luFile }
					]
				},
				{ id: 'src-routes', label: 'routes', icon: luFolder, children: [{ id: 'page-svelte', label: '+page.svelte', icon: luFile }] }
			]
		},
		{
			id: 'docs',
			label: 'docs',
			icon: luFolder,
			children: [
				{ id: 'readme', label: 'README.md', icon: luFile },
				{ id: 'changelog', label: 'CHANGELOG.md', icon: luFile }
			]
		},
		{ id: 'package', label: 'package.json', icon: luFile }
	];

	let expanded = $state(new Set<string>(['src', 'src-lib']));
	let selected = $state<string | null>('tree-ts');
</script>

<Tree {items} bind:expanded bind:selected label="Repository" />
