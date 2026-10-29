<script lang="ts">
	import { DropdownMenu, Button } from '$lib/styler';
	import { luPencil, luCopy, luTrash2 } from '@fractaldesign/icons/lucide';

	const items = [
		{ label: 'Edit', icon: luPencil, shortcut: '⌘E' },
		{ label: 'Duplicate', icon: luCopy, shortcut: '⌘D' },
		{ separator: true },
		{ label: 'Delete', icon: luTrash2, danger: true }
	];
</script>

<DropdownMenu {items}>
	{#snippet trigger({ toggle })}<Button onclick={toggle}>Options</Button>{/snippet}
</DropdownMenu>
