<!-- @example Unframed :: framed={false} drops the border and surface fill, for a table that sits inside a card. -->
<script lang="ts">
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box border modern rim shad-sm bg-surface pad-bs gap-sm">
	<p class="text-sm weight-600">Plan limits</p>
	<Table framed={false} size="sm" hoverable={false}>
		<TableCaption visuallyHidden>Plan limits</TableCaption>
		<TableHead>
			<TableRow>
				<TableHeader>Resource</TableHeader>
				<TableHeader numeric>Starter</TableHeader>
				<TableHeader numeric>Team</TableHeader>
			</TableRow>
		</TableHead>
		<TableBody>
			<TableRow><TableCell>Projects</TableCell><TableCell numeric>3</TableCell><TableCell numeric>50</TableCell></TableRow>
			<TableRow><TableCell>Build minutes</TableCell><TableCell numeric>500</TableCell><TableCell numeric>6,000</TableCell></TableRow>
			<TableRow><TableCell>Bandwidth (GB)</TableCell><TableCell numeric>100</TableCell><TableCell numeric>1,000</TableCell></TableRow>
		</TableBody>
	</Table>
</div>
