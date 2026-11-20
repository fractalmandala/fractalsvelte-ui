<!-- @example Duplicates, variants, sizes and shapes :: Repeated labels, and the same axes as Input. -->
<script lang="ts">
	import { TagsInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<TagsInput allowDuplicates value={['Proof', 'Proof']} aria-label="Repeatable proof stages" />
	{#each ['outline', 'filled', 'ghost'] as const as look (look)}
		<TagsInput {look} value={['Harbor']} aria-label={`${look} tags`} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<TagsInput {size} value={['Northwind']} aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<TagsInput {shape} value={['Fjord']} aria-label={`Shape ${shape}`} />
	{/each}
</div>
