<!-- @example Variants, sizes and shapes :: The same axes as Input. -->
<script lang="ts">
	import { SearchInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as look (look)}
		<SearchInput {look} value="Harbor" aria-label={`${look} search`} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<SearchInput {size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<SearchInput {shape} placeholder={`Shape ${shape}`} aria-label={`Shape ${shape}`} />
	{/each}
</div>
