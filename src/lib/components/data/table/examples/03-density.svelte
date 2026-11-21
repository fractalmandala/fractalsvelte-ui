<!-- @example Density, stripes and hover :: density sets the row height; striped shades every other row; hoverable={false} keeps rows still. -->
<script lang="ts">
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@fractaldesign/fractalsvelte-ui';

	const regions = [
		{ region: 'us-east-1', p50: 42, p99: 188 },
		{ region: 'eu-west-2', p50: 51, p99: 214 },
		{ region: 'ap-south-1', p50: 77, p99: 302 },
		{ region: 'sa-east-1', p50: 96, p99: 371 }
	];
	const variants: { density: 'compact' | 'cozy' | 'comfortable'; striped: boolean; hoverable: boolean }[] = [
		{ density: 'compact', striped: true, hoverable: true },
		{ density: 'cozy', striped: false, hoverable: true },
		{ density: 'comfortable', striped: true, hoverable: false }
	];
</script>

<div class="box gap-lg">
	{#each variants as { density, striped, hoverable } (density)}
		<Table {density} {striped} {hoverable} surface="outlined" shape="curved">
			<TableCaption textSize="text-md" textColor="text-muted">Latency at {density} density</TableCaption>
			<TableHead>
				<TableRow>
					<TableHeader>Region</TableHeader>
					<TableHeader numeric>p50 (ms)</TableHeader>
					<TableHeader numeric>p99 (ms)</TableHeader>
				</TableRow>
			</TableHead>
			<TableBody>
				{#each regions as r (r.region)}
					<TableRow>
						<TableCell class="font-mono">{r.region}</TableCell>
						<TableCell numeric>{r.p50}</TableCell>
						<TableCell numeric>{r.p99}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	{/each}
</div>
