<!-- @example Usage :: A Harbour notes toolbar with cut, copy and paste, a quiet link, and a hairline between clusters. -->
<script lang="ts">
	import { luClipboard, luCopy, luScissors } from '@fractaldesign/icons/lucide';
	import { IconButton, Link, Toolbar, ToolbarSeparator } from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No action yet');
</script>

<div class="box gap-sm">
	<Toolbar orientation="horizontal" label="Harbour notes">
		<IconButton icon={luScissors} label="Cut" variant="ghost" size="sm" onclick={() => (log = 'Cut')} />
		<IconButton icon={luCopy} label="Copy" variant="ghost" size="sm" onclick={() => (log = 'Copied')} />
		<IconButton icon={luClipboard} label="Paste" variant="ghost" size="sm" onclick={() => (log = 'Pasted')} />
		<ToolbarSeparator />
		<Link href="https://northwind.dev/guides/harbour-notes" underline="hover">Editing guide</Link>
	</Toolbar>
	<span class="text-sm text-muted">{log}</span>
</div>
