<script lang="ts">
	import { Table } from '@fractaldesign/fractalsvelte-ui';
	import type { Column } from '@fractaldesign/fractalsvelte-ui';

	const columns: Column[] = [
		{ key: 'project', label: 'Project', sortable: true },
		{ key: 'status', label: 'Status' },
		{ key: 'version', label: 'Version', align: 'right' }
	];

	const rows = [
		{ project: 'fractalsvelte-ui', status: 'Published', version: '1.0.0' },
		{ project: 'fractalstyler', status: 'Published', version: '1.5.0' },
		{ project: 'fractalicons', status: 'Published', version: '0.1.0' }
	];
</script>

<Table {columns} {rows} striped caption="Fractal Design Packages" />
