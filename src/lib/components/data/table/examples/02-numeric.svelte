<!-- @example Numbers and alignment :: numeric right-aligns on tabular numerals; align sets any column to left, center or right. -->
<script lang="ts">
	import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fractaldesign/fractalsvelte-ui';

	const invoices = [
		{ id: 'INV-2041', customer: 'Northwind Traders', seats: 48, amount: 4320.0 },
		{ id: 'INV-2042', customer: 'Lumen Health', seats: 12, amount: 1080.5 },
		{ id: 'INV-2043', customer: 'Fable & Co.', seats: 230, amount: 20700.0 },
		{ id: 'INV-2044', customer: 'Orbital Labs', seats: 7, amount: 630.25 }
	];
	const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
	const total = invoices.reduce((sum, i) => sum + i.amount, 0);
</script>

<Table>
	<TableCaption visuallyHidden>Open invoices</TableCaption>
	<TableHead>
		<TableRow>
			<TableHeader width="8rem">Invoice</TableHeader>
			<TableHeader align="left">Customer</TableHeader>
			<TableHeader align="center">Seats</TableHeader>
			<TableHeader numeric>Amount</TableHeader>
		</TableRow>
	</TableHead>
	<TableBody>
		{#each invoices as inv (inv.id)}
			<TableRow>
				<TableCell class="font-mono text-sm">{inv.id}</TableCell>
				<TableCell>{inv.customer}</TableCell>
				<TableCell align="center" class="tabular-nums">{inv.seats}</TableCell>
				<TableCell numeric>{usd.format(inv.amount)}</TableCell>
			</TableRow>
		{/each}
		<TableRow>
			<TableHeader scope="row" colspan={3} align="right">Total</TableHeader>
			<TableCell numeric class="weight-600">{usd.format(total)}</TableCell>
		</TableRow>
	</TableBody>
</Table>
