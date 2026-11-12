<!-- @example Selection and row click :: bind:selection with a change callback; shift-click a checkbox for a range; onRowClick highlights the active invoice. -->
<script lang="ts">
	import { DataTable, type Column } from '@fractaldesign/fractalsvelte-ui';

	interface Member {
		id: string;
		name: string;
		role: string;
		team: string;
		location: string;
	}

	const rows: Member[] = [
		{ id: 'm-ines', name: 'Ines Duarte', role: 'Staff engineer', team: 'Platform', location: 'Lisbon' },
		{ id: 'm-kenji', name: 'Kenji Mori', role: 'Product designer', team: 'Growth', location: 'Osaka' },
		{ id: 'm-amara', name: 'Amara Okafor', role: 'Engineering manager', team: 'Billing', location: 'Accra' },
		{ id: 'm-lukas', name: 'Lukas Berg', role: 'Site reliability', team: 'Platform', location: 'Stockholm' },
		{ id: 'm-nina', name: 'Nina Varela', role: 'Data engineer', team: 'Analytics', location: 'Buenos Aires' },
		{ id: 'm-owen', name: 'Owen Blake', role: 'Product manager', team: 'Growth', location: 'Toronto' }
	];

	const columns: Column<Member>[] = [
		{ key: 'name', header: 'Name', sortable: true },
		{ key: 'role', header: 'Role', sortable: true },
		{ key: 'team', header: 'Team', sortable: true },
		{ key: 'location', header: 'Location' }
	];

	let selection = $state(new Set<string>(['m-amara']));
	let active = $state<string>('m-amara');

	function onSelectionChange(next: Set<string>) {
		selection = next;
	}

	function onRowClick(row: Member) {
		active = row.id;
	}
</script>

<div class="box gap-sm">
	<DataTable
		{columns}
		{rows}
		rowKey="id"
		bind:selection
		{onSelectionChange}
		{onRowClick}
		caption="Team members"
		hoverable
		pageSize={6}
	/>
	<p class="text-sm text-muted">
		Active: {rows.find((row) => row.id === active)?.name}. Selected {selection.size} of {rows.length}.
	</p>
</div>
