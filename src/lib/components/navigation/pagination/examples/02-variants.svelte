<!-- @example Variants :: Numbers, a written position, and a compact readout. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';

	const variants = ['numbers', 'simple', 'compact'] as const;
	let page = $state(6);
</script>

<div class="box gap-xl">
	{#each variants as variant (variant)}
		<div class="box gap-sm">
			<p class="text-sm text-muted weight-500">{variant}</p>
			<Pagination bind:page {variant} count={18} />
		</div>
	{/each}
</div>
