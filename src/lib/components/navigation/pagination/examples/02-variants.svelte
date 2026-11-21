<!-- @example Variants :: Numbers, a written position, and a compact readout. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';

	const forms = ['numbers', 'simple', 'compact'] as const;
	let page = $state(6);
</script>

<div class="box gap-xl">
	{#each forms as form (form)}
		<div class="box gap-sm">
			<p class="text-sm text-muted weight-500">{form}</p>
			<Pagination page={3} total={10} disabled />
<Pagination bind:page {form} count={18} textColor="text-muted" childTextColor="text-secondary" />
		</div>
	{/each}
</div>
