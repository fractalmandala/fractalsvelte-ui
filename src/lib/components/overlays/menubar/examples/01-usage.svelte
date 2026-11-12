<!-- @example Usage :: A Harbour desk menubar with File, Edit and View, including a submenu, a link and a disabled item. -->
<script lang="ts">
	import { luCopy, luDownload, luFile, luFolder, luScissors, luShare, luTrash2 } from '@fractaldesign/icons/lucide';
	import {
		Menubar,
		MenubarMenu,
		MenuItem,
		MenuLabel,
		MenuSeparator,
		MenuSub
	} from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No action yet');
</script>

<div class="box gap-sm">
	<Menubar label="Harbour desk">
		<MenubarMenu value="file" label="File">
			<MenuLabel>Document</MenuLabel>
			<MenuItem icon={luFile} shortcut="⌘N" onclick={() => (log = 'New document')}>New document</MenuItem>
			<MenuItem icon={luFolder} shortcut="⌘O" onclick={() => (log = 'Open…')}>Open…</MenuItem>
			<MenuSeparator />
			<MenuSub icon={luShare} label="Export">
				<MenuItem onclick={() => (log = 'Exported PDF')}>PDF</MenuItem>
				<MenuItem icon={luDownload} href="https://northwind.dev/exports/harbour.csv">
					Download CSV
				</MenuItem>
			</MenuSub>
			<MenuSeparator />
			<MenuItem icon={luTrash2} shortcut="⌘⌫" disabled>Delete (locked)</MenuItem>
		</MenubarMenu>
		<MenubarMenu value="edit" label="Edit">
			<MenuItem icon={luScissors} shortcut="⌘X" onclick={() => (log = 'Cut')}>Cut</MenuItem>
			<MenuItem icon={luCopy} shortcut="⌘C" onclick={() => (log = 'Copy')}>Copy</MenuItem>
			<MenuItem inset shortcut="⌘V" onclick={() => (log = 'Paste')}>Paste</MenuItem>
		</MenubarMenu>
		<MenubarMenu value="view" label="View">
			<MenuItem onclick={() => (log = 'Zoomed in')}>Zoom in</MenuItem>
			<MenuItem onclick={() => (log = 'Zoomed out')}>Zoom out</MenuItem>
			<MenuItem onclick={() => (log = 'Reset zoom')}>Reset zoom</MenuItem>
		</MenubarMenu>
	</Menubar>
	<span class="text-sm text-muted">{log}</span>
</div>
