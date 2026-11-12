<!-- @example Sticky header and selected rows :: maxHeight caps the scroll region, stickyHeader pins the header, label makes the region focusable, and selected highlights a row. -->
<script lang="ts">
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@fractaldesign/fractalsvelte-ui';

	const services = ['api-gateway', 'auth', 'billing', 'search', 'notifications', 'media', 'ledger', 'webhooks', 'scheduler', 'analytics', 'exports', 'audit-log'];
	const deploys = services.map((service, i) => ({
		service,
		version: `v2.${14 + i}.${(i * 7) % 10}`,
		duration: 38 + ((i * 53) % 140),
		author: ['Ines', 'Kenji', 'Amara', 'Lukas'][i % 4]
	}));
	let current = $state('billing');
</script>

<Table stickyHeader maxHeight="16rem" label="Recent deployments">
	<TableCaption visuallyHidden>Recent deployments</TableCaption>
	<TableHead>
		<TableRow>
			<TableHeader>Service</TableHeader>
			<TableHeader>Version</TableHeader>
			<TableHeader>Author</TableHeader>
			<TableHeader numeric>Build (s)</TableHeader>
		</TableRow>
	</TableHead>
	<TableBody>
		{#each deploys as d (d.service)}
			<TableRow selected={d.service === current} onclick={() => (current = d.service)} class="pointer">
				<TableCell>{d.service}</TableCell>
				<TableCell class="font-mono text-sm" muted>{d.version}</TableCell>
				<TableCell>{d.author}</TableCell>
				<TableCell numeric>{d.duration}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
