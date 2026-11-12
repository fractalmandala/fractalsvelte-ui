<!-- @example Usage :: A typed grid of deployments with sortable columns, a filter and a pager. -->
<script lang="ts">
	import { DataTable, type Column } from '@fractaldesign/fractalsvelte-ui';

	interface Deploy {
		id: string;
		service: string;
		version: string;
		author: string;
		duration: number;
		status: string;
	}

	const rows: Deploy[] = [
		{ id: 'dpl_8f21', service: 'api-gateway', version: 'v2.14.0', author: 'Ines Duarte', duration: 54, status: 'Ready' },
		{ id: 'dpl_8f22', service: 'auth', version: 'v2.15.1', author: 'Kenji Mori', duration: 71, status: 'Ready' },
		{ id: 'dpl_8f23', service: 'billing', version: 'v2.16.0', author: 'Amara Okafor', duration: 118, status: 'Ready' },
		{ id: 'dpl_8f24', service: 'search', version: 'v2.14.3', author: 'Lukas Berg', duration: 89, status: 'Building' },
		{ id: 'dpl_8f25', service: 'notifications', version: 'v2.17.2', author: 'Ines Duarte', duration: 43, status: 'Ready' },
		{ id: 'dpl_8f26', service: 'media', version: 'v2.13.8', author: 'Kenji Mori', duration: 162, status: 'Failed' },
		{ id: 'dpl_8f27', service: 'ledger', version: 'v2.18.0', author: 'Amara Okafor', duration: 97, status: 'Ready' },
		{ id: 'dpl_8f28', service: 'webhooks', version: 'v2.15.4', author: 'Lukas Berg', duration: 61, status: 'Ready' },
		{ id: 'dpl_8f29', service: 'scheduler', version: 'v2.16.1', author: 'Ines Duarte', duration: 80, status: 'Ready' },
		{ id: 'dpl_8f30', service: 'analytics', version: 'v2.19.0', author: 'Kenji Mori', duration: 204, status: 'Building' },
		{ id: 'dpl_8f31', service: 'exports', version: 'v2.14.9', author: 'Amara Okafor', duration: 133, status: 'Ready' },
		{ id: 'dpl_8f32', service: 'audit-log', version: 'v2.15.0', author: 'Lukas Berg', duration: 58, status: 'Ready' }
	];

	const columns: Column<Deploy>[] = [
		{ key: 'service', header: 'Service', sortable: true },
		{ key: 'version', header: 'Version', sortable: true, width: '8rem' },
		{ key: 'author', header: 'Author', sortable: true },
		{ key: 'duration', header: 'Build (s)', sortable: true, align: 'right' },
		{ key: 'status', header: 'Status', sortable: true, align: 'center' }
	];
</script>

<DataTable {columns} {rows} rowKey="id" caption="Recent deployments" pageSize={6} />
