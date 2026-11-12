<!-- @example Pages, density and loading :: page, pageSize and their callbacks; loading shows skeleton rows; size covers sm, md and lg. -->
<script lang="ts">
	import { Button, DataTable, type Column } from '@fractaldesign/fractalsvelte-ui';

	interface EventRow {
		id: string;
		event: string;
		actor: string;
		target: string;
		when: string;
	}

	const rows: EventRow[] = [
		{ id: 'evt-01', event: 'deploy.started', actor: 'Ines Duarte', target: 'api-gateway', when: '09:14' },
		{ id: 'evt-02', event: 'deploy.ready', actor: 'github-actions', target: 'api-gateway', when: '09:15' },
		{ id: 'evt-03', event: 'secret.rotated', actor: 'Amara Okafor', target: 'billing', when: '09:31' },
		{ id: 'evt-04', event: 'invite.sent', actor: 'Kenji Mori', target: 'nina@fable.co', when: '09:44' },
		{ id: 'evt-05', event: 'alert.acked', actor: 'Lukas Berg', target: 'search p99', when: '10:02' },
		{ id: 'evt-06', event: 'branch.merged', actor: 'Ines Duarte', target: 'media#1841', when: '10:11' },
		{ id: 'evt-07', event: 'deploy.failed', actor: 'github-actions', target: 'media', when: '10:18' },
		{ id: 'evt-08', event: 'incident.opened', actor: 'Lukas Berg', target: 'media 5xx', when: '10:19' },
		{ id: 'evt-09', event: 'deploy.started', actor: 'Ines Duarte', target: 'media', when: '10:27' },
		{ id: 'evt-10', event: 'deploy.ready', actor: 'github-actions', target: 'media', when: '10:29' },
		{ id: 'evt-11', event: 'incident.closed', actor: 'Lukas Berg', target: 'media 5xx', when: '10:33' },
		{ id: 'evt-12', event: 'token.revoked', actor: 'Amara Okafor', target: 'ci-bot', when: '10:41' }
	];

	const columns: Column<EventRow>[] = [
		{ key: 'when', header: 'Time', sortable: true, width: '6rem' },
		{ key: 'event', header: 'Event', sortable: true },
		{ key: 'actor', header: 'Actor' },
		{ key: 'target', header: 'Target' }
	];

	let page = $state(1);
	let pageSize = $state(4);
	let loading = $state(false);
	const sizes = ['sm', 'md', 'lg'] as const;
	let size = $state<(typeof sizes)[number]>('sm');

	function onPageChange(next: number) {
		page = next;
	}

	function onPageSizeChange(next: number) {
		pageSize = next;
		page = 1;
	}

	function refresh() {
		loading = true;
		setTimeout(() => (loading = false), 1200);
	}
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		<Button variant="outline" size="sm" onclick={refresh} {loading}>Refresh</Button>
		{#each sizes as value (value)}
			<Button variant={size === value ? 'soft' : 'ghost'} size="sm" onclick={() => (size = value)}>
				{value}
			</Button>
		{/each}
		<Button variant="ghost" size="sm" onclick={() => onPageSizeChange(pageSize === 4 ? 8 : 4)}>
			{pageSize} / page
		</Button>
	</div>
	<DataTable
		{columns}
		{rows}
		rowKey="id"
		bind:page
		{onPageChange}
		{pageSize}
		{onPageSizeChange}
		{loading}
		{size}
		caption="Audit log"
		striped
	/>
</div>
