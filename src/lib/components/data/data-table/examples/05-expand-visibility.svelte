<!-- @example Detail rows, visibility and layout :: detail and bind:expanded, hiddenColumns, stickyHeader, maxHeight, label, framed and an empty snippet. -->
<script lang="ts">
	import { Button, DataTable, type Column } from '@fractaldesign/fractalsvelte-ui';

	interface Service {
		id: string;
		service: string;
		region: string;
		p99: number;
		errorRate: number;
		owner: string;
		runbook: string;
	}

	const rows: Service[] = [
		{ id: 'svc-api', service: 'api-gateway', region: 'us-east-1', p99: 188, errorRate: 0.12, owner: 'Ines Duarte', runbook: 'Page the platform on-call if p99 stays above 250ms for five minutes. Check the edge cache first.' },
		{ id: 'svc-auth', service: 'auth', region: 'us-east-1', p99: 94, errorRate: 0.04, owner: 'Kenji Mori', runbook: 'A spike in 401s is usually a key rotation mid-flight. Confirm the JWKS endpoint before rolling back.' },
		{ id: 'svc-bill', service: 'billing', region: 'eu-west-2', p99: 214, errorRate: 0.07, owner: 'Amara Okafor', runbook: 'Invoice generation is idempotent. Replay the failed batch from the ledger console; never retry from the cron.' },
		{ id: 'svc-search', service: 'search', region: 'ap-south-1', p99: 302, errorRate: 0.21, owner: 'Lukas Berg', runbook: 'Reindex the last hour of documents, then drain the query queue. Watch heap on the ingest nodes.' },
		{ id: 'svc-media', service: 'media', region: 'us-east-1', p99: 410, errorRate: 0.33, owner: 'Ines Duarte', runbook: 'Transcodes pile up when the GPU pool saturates. Shed the preview profile before touching production traffic.' },
		{ id: 'svc-ledger', service: 'ledger', region: 'eu-west-2', p99: 156, errorRate: 0.02, owner: 'Amara Okafor', runbook: 'The ledger is append-only. If a write stalls, fail over the primary and keep the replica read-only.' },
		{ id: 'svc-hooks', service: 'webhooks', region: 'us-east-1', p99: 121, errorRate: 0.09, owner: 'Kenji Mori', runbook: 'Deliveries retry with backoff for 24 hours. Pause a noisy endpoint rather than dropping the queue.' },
		{ id: 'svc-analytics', service: 'analytics', region: 'sa-east-1', p99: 371, errorRate: 0.18, owner: 'Nina Varela', runbook: 'Late events are stored in the overflow topic. Backfill with the dated job, never a full replay.' }
	];

	const columns: Column<Service>[] = [
		{ key: 'service', header: 'Service', sortable: true },
		{ key: 'region', header: 'Region', sortable: true },
		{ key: 'p99', header: 'p99 (ms)', sortable: true, align: 'right' },
		{ key: 'errorRate', header: 'Errors %', sortable: true, align: 'right', hidden: true },
		{ key: 'owner', header: 'Owner' }
	];

	let expanded = $state(new Set<string>(['svc-search']));
	let hiddenColumns = $state(new Set<string>(['errorRate']));
	let framed = $state(true);
	let showEmpty = $state(false);

	function onExpandedChange(next: Set<string>) {
		expanded = next;
	}

	function onHiddenColumnsChange(next: Set<string>) {
		hiddenColumns = next;
	}
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		<Button variant="outline" size="sm" onclick={() => (framed = !framed)}>
			{framed ? 'Framed' : 'Unframed'}
		</Button>
		<Button variant="outline" size="sm" onclick={() => (showEmpty = !showEmpty)}>
			{showEmpty ? 'Show rows' : 'Show empty'}
		</Button>
	</div>
	<DataTable
		{columns}
		rows={showEmpty ? [] : rows}
		rowKey="id"
		bind:expanded
		{onExpandedChange}
		bind:hiddenColumns
		{onHiddenColumnsChange}
		stickyHeader
		maxHeight="16rem"
		label="Service latency"
		caption="Service latency"
		captionHidden
		{framed}
		hoverable={false}
		size="md"
		pageSize={6}
	>
		{#snippet empty()}
			<div class="box xcenter gap-sm">
				<p class="weight-600">No services to show</p>
				<p class="text-sm text-muted">Clear the empty-state toggle to bring the rows back.</p>
			</div>
		{/snippet}
		{#snippet detail(row)}
			<div class="box gap-xs">
				<p class="text-sm weight-600">{row.service} runbook</p>
				<p class="text-sm text-secondary">{row.runbook}</p>
			</div>
		{/snippet}
	</DataTable>
</div>
