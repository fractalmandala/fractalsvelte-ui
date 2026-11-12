<!-- @example Usage :: Open the palette from a button, search, and run a command. Matches are highlighted and staggered in. -->
<script lang="ts">
	import { luFile, luFolder, luPlus, luSettings, luUser } from '@fractaldesign/icons/lucide';
	import { Button, CommandPalette, type Command } from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No command yet');

	const commands: Command[] = [
		{ id: 'new-doc', label: 'New document', group: 'Documents', icon: luFile, shortcut: '⌘N', keywords: 'create file', onSelect: () => (log = 'New document') },
		{ id: 'open-harbour', label: 'Open Harbour invoices', group: 'Documents', icon: luFolder, shortcut: '⌘O', keywords: 'project', onSelect: () => (log = 'Opened Harbour invoices') },
		{ id: 'new-person', label: 'Invite a teammate', group: 'People', icon: luUser, keywords: 'member add', onSelect: () => (log = 'Invite a teammate') },
		{ id: 'new-issue', label: 'Create an issue', group: 'Issues', icon: luPlus, shortcut: 'C', onSelect: () => (log = 'Create an issue') },
		{ id: 'settings', label: 'Open workspace settings', group: 'Workspace', icon: luSettings, shortcut: '⌘,', keywords: 'preferences', onSelect: () => (log = 'Workspace settings') }
	];
</script>

<div class="row wrap gap-sm ycenter">
	<CommandPalette {commands} placeholder="Search documents, people, issues…">
		{#snippet trigger({ props })}
			<Button variant="outline" {...props}>Command palette</Button>
		{/snippet}
	</CommandPalette>
	<span class="text-sm text-muted">{log}</span>
</div>
