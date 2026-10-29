<script lang="ts">
	import { DataTable } from '$lib/styler';

	const columns = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'role', label: 'Role' }
	];
	const rows = [
		{ name: 'Asha', role: 'Designer' },
		{ name: 'Ravi', role: 'Engineer' },
		{ name: 'Meera', role: 'Manager' }
	];
</script>

<DataTable {columns} {rows} />
