<!-- @example Usage :: A file menu with icons, shortcuts, a disabled item, a link and a separator. -->
<script lang="ts">
	import { luCopy, luDownload, luFile, luFolder, luTrash2 } from '@fractaldesign/icons/lucide';
	import {
		Button,
		DropdownMenu,
		MenuItem,
		MenuLabel,
		MenuSeparator
	} from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No action yet');
</script>

<div class="row wrap gap-sm ycenter">
	<DropdownMenu>
		{#snippet trigger({ props })}
			<Button variant="outline" {...props}>File</Button>
		{/snippet}
		<MenuLabel>Harbour invoices</MenuLabel>
		<MenuItem icon={luFile} shortcut="⌘N" onclick={() => (log = 'New document')}>New document</MenuItem>
		<MenuItem icon={luFolder} shortcut="⌘O" onclick={() => (log = 'Open…')}>Open…</MenuItem>
		<MenuItem icon={luCopy} shortcut="⌘⇧S" onclick={() => (log = 'Duplicate')}>Duplicate</MenuItem>
		<MenuSeparator />
		<MenuItem icon={luDownload} href="https://northwind.dev/exports/harbour.csv">Download CSV</MenuItem>
		<MenuItem inset>Rename…</MenuItem>
		<MenuSeparator />
		<MenuItem icon={luTrash2} shortcut="⌘⌫" disabled>Delete (locked)</MenuItem>
	</DropdownMenu>
	<span class="text-sm text-muted">{log}</span>
</div>
