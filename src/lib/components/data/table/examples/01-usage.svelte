<!-- @example Usage :: A caption, a header row and a few body rows — the plain table. -->
<script lang="ts">
	import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fractaldesign/fractalsvelte-ui';

	const members = [
		{ name: 'Ines Duarte', role: 'Staff engineer', team: 'Platform' },
		{ name: 'Kenji Mori', role: 'Product designer', team: 'Growth' },
		{ name: 'Amara Okafor', role: 'Engineering manager', team: 'Billing' }
	];
</script>

<Table>
	<TableCaption>Team members</TableCaption>
	<TableHead>
		<TableRow>
			<TableHeader>Name</TableHeader>
			<TableHeader>Role</TableHeader>
			<TableHeader>Team</TableHeader>
		</TableRow>
	</TableHead>
	<TableBody>
		{#each members as m (m.name)}
			<TableRow>
				<TableCell>{m.name}</TableCell>
				<TableCell muted>{m.role}</TableCell>
				<TableCell>{m.team}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
