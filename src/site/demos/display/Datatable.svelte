<script lang="ts">
	import Datatable from '$lib/components/display/Datatable.svelte';
	import type { Column } from '$lib/types.js';

	interface User {
		id: number;
		name: string;
		role: string;
		status: string;
	}

	const columns: Column<User>[] = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'role', label: 'Role', sortable: true },
		{ key: 'status', label: 'Status' }
	];

	const rows: User[] = [
		{ id: 1, name: 'Ada Lovelace', role: 'Pioneer', status: 'Active' },
		{ id: 2, name: 'Alan Turing', role: 'Cryptanalyst', status: 'Active' },
		{ id: 3, name: 'Grace Hopper', role: 'Architect', status: 'Offline' }
	];
</script>

<Datatable {columns} {rows} rowKey="id" searchable selectable />
