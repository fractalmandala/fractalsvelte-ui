<!-- @example Gaps :: Every step of the space ladder, from xs to 3xl. -->
<script lang="ts">
	import { BentoGrid, BentoItem } from '@fractaldesign/fractalsvelte-ui';

	const gaps = ['gap-xs', 'gap-sm', 'gap-md', 'gap-bs', 'gap-lg', 'gap-xl', 'gap-2xl', 'gap-3xl'] as const;
</script>

<div class="column gap-lg measure-lg">
	{#each gaps as gap (gap)}
		<BentoGrid columns={2} {gap} rowHeight="3rem">
			<BentoItem><span class="text-xs text-muted">{gap}</span></BentoItem>
			<BentoItem><span class="text-xs text-muted">&nbsp;</span></BentoItem>
		</BentoGrid>
	{/each}
</div>
