<!-- @example Rename in place :: Double-click a branch or press F2 to edit its label, with the indent guides turned off. -->
<script lang="ts">
	import { Tree, type TreeItem } from '@fractaldesign/fractalsvelte-ui';
	import { luFile, luFolder } from '@fractaldesign/icons/lucide';

	let items = $state<TreeItem[]>([
		{
			id: 'src',
			label: 'src',
			icon: luFolder,
			children: [
				{ id: 'routes', label: 'routes', icon: luFolder },
				{ id: 'app', label: 'app.html', icon: luFile },
				{ id: 'hooks', label: 'hooks.ts', icon: luFile }
			]
		},
		{ id: 'svelte-config', label: 'svelte.config.js', icon: luFile }
	]);

	let expanded = $state(new Set<string>(['src']));
	let selected = $state<string | null>(null);

	function onRename(id: string, label: string) {
		items = items.map((node) =>
			node.id === id
				? { ...node, label }
				: { ...node, children: node.children?.map((kid) => (kid.id === id ? { ...kid, label } : kid)) }
		);
	}
</script>

<div class="box gap-xs measure-xs">
	<Tree {items} bind:expanded bind:selected {onRename} renamable guides={false} label="Project files" />
	<p class="text-sm text-muted">Selected: {selected ?? 'none'}</p>
</div>
