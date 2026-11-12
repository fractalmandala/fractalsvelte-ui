<!-- @example Sort and filter :: bind:sort and bind:filter, with a per-column filter and a change callback. Shift-click a header to add a column to the sort. -->
<script lang="ts">
	import { DataTable, type Column, type SortRule } from '@fractaldesign/fractalsvelte-ui';

	interface Invoice {
		id: string;
		customer: string;
		seats: number;
		amount: number;
		issued: string;
	}

	const rows: Invoice[] = [
		{ id: 'INV-2041', customer: 'Northwind Traders', seats: 48, amount: 4320, issued: '2026-10-02' },
		{ id: 'INV-2042', customer: 'Lumen Health', seats: 12, amount: 1080.5, issued: '2026-10-08' },
		{ id: 'INV-2043', customer: 'Fable & Co.', seats: 230, amount: 20700, issued: '2026-10-14' },
		{ id: 'INV-2044', customer: 'Orbital Labs', seats: 7, amount: 630.25, issued: '2026-10-19' },
		{ id: 'INV-2045', customer: 'Harbour & Pine', seats: 31, amount: 2790, issued: '2026-10-22' },
		{ id: 'INV-2046', customer: 'Kite Mutual', seats: 90, amount: 8100, issued: '2026-11-01' },
		{ id: 'INV-2047', customer: 'Sable Press', seats: 16, amount: 1440, issued: '2026-11-04' },
		{ id: 'INV-2048', customer: 'Northwind Traders', seats: 52, amount: 4680, issued: '2026-11-09' }
	];

	const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	const columns: Column<Invoice>[] = [
		{ key: 'id', header: 'Invoice', sortable: true, width: '8rem', filter: (row, query) => row.id.toLowerCase().includes(query.trim().toLowerCase()) },
		{ key: 'customer', header: 'Customer', sortable: true },
		{ key: 'seats', header: 'Seats', sortable: true, align: 'center' },
		{
			key: 'amount',
			header: 'Amount',
			sortable: true,
			align: 'right',
			accessor: (row) => usd.format(row.amount)
		},
		{ key: 'issued', header: 'Issued', sortable: true, align: 'left' }
	];

	let sort = $state<SortRule[]>([{ key: 'issued', direction: 'desc' }]);
	let filter = $state('');
	let lastSort = $state('issued descending');

	function onSortChange(next: SortRule[]) {
		lastSort = next.length ? next.map((rule) => `${rule.key} ${rule.direction}`).join(', ') : 'none';
	}

	function onFilterChange(next: string) {
		filter = next;
	}
</script>

<div class="box gap-sm">
	<DataTable
		{columns}
		{rows}
		rowKey="id"
		bind:sort
		{onSortChange}
		bind:filter
		{onFilterChange}
		caption="Open invoices"
		pageSize={5}
	/>
	<p class="text-sm text-muted">Sort: {lastSort}</p>
</div>
