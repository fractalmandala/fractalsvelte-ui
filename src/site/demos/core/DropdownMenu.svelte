<script lang="ts">
	import { DropdownMenu, Button } from '@fractaldesign/fractalsvelte-ui';
	import { klCopy, klDelete, klPen } from '@fractaldesign/fractalsvelte-ui/icons/keylinestroke';

	const items = [
		{ label: 'Edit', icon: klPen, shortcut: '⌘E' },
		{ label: 'Duplicate', icon: klCopy, shortcut: '⌘D' },
		{ separator: true },
		{ label: 'Delete', icon: klDelete, danger: true }
	];
</script>

<DropdownMenu {items}>
	{#snippet trigger({ toggle })}<Button onclick={toggle}>Options</Button>{/snippet}
</DropdownMenu>
