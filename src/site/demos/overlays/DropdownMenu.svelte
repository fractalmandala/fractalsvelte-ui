<script lang="ts">
	import DropdownMenu from '$lib/components/overlays/DropdownMenu.svelte';
	import Button from '$lib/components/actions/Button.svelte';
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
