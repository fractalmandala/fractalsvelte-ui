<!-- @example Global shortcut :: shortcut="mod+k" toggles the palette from anywhere, with a glass surface, a custom empty state and custom footer hints. -->
<script lang="ts">
	import { luCopy, luPencil, luStar, luTrash2 } from '@fractaldesign/icons/lucide';
	import { Button, CommandPalette, type Command } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let log = $state('Press ⌘K or Ctrl+K');

	const commands: Command[] = [
		{ id: 'rename', label: 'Rename project', group: 'Project', icon: luPencil, keywords: 'edit title', onSelect: () => (log = 'Rename project') },
		{ id: 'star', label: 'Star project', group: 'Project', icon: luStar, onSelect: () => (log = 'Starred') },
		{ id: 'copy', label: 'Copy share link', group: 'Share', icon: luCopy, shortcut: '⌘⇧L', onSelect: () => (log = 'Copied share link') },
		{ id: 'delete', label: 'Delete project', group: 'Danger', icon: luTrash2, keywords: 'remove destroy', onSelect: () => (log = 'Delete project') }
	];
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="secondary" onclick={() => (open = true)}>Open palette</Button>
	<span class="text-sm text-muted">{log}</span>
</div>

<CommandPalette
	bind:open
	{commands}
	shortcut="mod+k"
	surface="glass"
	placeholder="Type a command…"
	onOpenChange={(next) => {
		if (next) log = 'Palette open — try typing “star”';
	}}
>
	{#snippet empty(query)}
		No commands match “{query}”. Try “share” or “star”.
	{/snippet}
	{#snippet footer()}
		<span class="row ycenter gap-xs"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd> to toggle</span>
		<span class="row ycenter gap-xs"><kbd class="kbd">↵</kbd> to run</span>
	{/snippet}
</CommandPalette>
