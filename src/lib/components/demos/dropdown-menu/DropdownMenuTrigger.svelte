<script>
	import { Button, DropdownMenu } from 'fractalsvelte/components';

	const items = [
		{ label: 'Duplicate', shortcut: '⌘D' },
		{ label: 'Rename' },
		{ label: 'Move to…' }
	];
</script>

<DropdownMenu {items} align="end">
	{#snippet trigger(tp)}
		<Button variant="ghost" {...tp} aria-label="More actions">⋯</Button>
	{/snippet}
</DropdownMenu>
