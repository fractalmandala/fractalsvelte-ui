<script lang="ts">
	import MenuList from '$lib/components/overlays/MenuList.svelte';

	const items = [
		{ id: 'edit', label: 'Edit', shortcut: '⌘E' },
		{ id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
		{ separator: true },
		{ id: 'delete', label: 'Delete', danger: true }
	];
</script>

<MenuList {items} autofocus={false} onselect={() => {}} onclose={() => {}} />
