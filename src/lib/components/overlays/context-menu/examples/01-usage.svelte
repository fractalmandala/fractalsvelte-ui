<!-- @example Usage :: Right-click, long-press or Shift+F10 the memo to open a menu at the pointer. -->
<script lang="ts">
	import { luCopy, luPencil, luStar, luTrash2 } from '@fractaldesign/icons/lucide';
	import {
		ContextMenu,
		MenuItem,
		MenuLabel,
		MenuSeparator,
		MenuSub
	} from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No action yet');
</script>

<ContextMenu>
	{#snippet trigger({ props })}
		<button type="button" class="box gap-xs pad-bs radius-lg border bg-surface ta-l" {...props}>
			<p class="weight-600 text-primary">Call Harbour about the November invoices</p>
			<p class="text-sm text-secondary">Ada noted that three shipments landed on the 11th and still need packing lists.</p>
			<p class="text-xs text-muted">Right-click, long-press, or Shift+F10 · {log}</p>
		</button>
	{/snippet}
	<MenuLabel>Memo</MenuLabel>
	<MenuItem icon={luPencil} shortcut="⌘E" onclick={() => (log = 'Editing')}>Edit</MenuItem>
	<MenuItem icon={luCopy} shortcut="⌘C" onclick={() => (log = 'Copied')}>Copy</MenuItem>
	<MenuSub icon={luStar} label="Move to">
		<MenuItem onclick={() => (log = 'Moved to Today')}>Today</MenuItem>
		<MenuItem onclick={() => (log = 'Moved to Later')}>Later</MenuItem>
	</MenuSub>
	<MenuSeparator />
	<MenuItem icon={luTrash2} shortcut="⌘⌫" onclick={() => (log = 'Deleted')}>Delete</MenuItem>
</ContextMenu>
