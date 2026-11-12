<!-- @example Columns and dividers :: One to four columns, with hairlines between the pairs. -->
<script lang="ts">
	import { Button, DescriptionList } from '@fractaldesign/fractalsvelte-ui';

	const plan = [
		{ term: 'Plan', description: 'Team' },
		{ term: 'Seats', description: '3 of 10' },
		{ term: 'Billing', description: 'Monthly' },
		{ term: 'Renews', description: '1 Dec 2026' },
		{ term: 'Owner', description: 'Maya Chen' },
		{ term: 'Workspace', description: 'mintfolio-prod' },
		{ term: 'Region', description: 'eu-west-1' },
		{ term: 'Support', description: 'Business hours' }
	];

	let columns: '1' | '2' | '3' | '4' = $state('2');
</script>

<div class="box gap-bs">
	<div class="row wrap gap-sm">
		{#each ['1', '2', '3', '4'] as const as next}
			<Button variant={columns === next ? 'secondary' : 'ghost'} size="sm" onclick={() => (columns = next)}>
				{next}
			</Button>
		{/each}
	</div>
	<DescriptionList items={plan} {columns} dividers={true} orientation="vertical" />
</div>
