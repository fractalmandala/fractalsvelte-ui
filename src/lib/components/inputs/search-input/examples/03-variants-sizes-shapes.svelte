<!-- @example Variants, sizes and shapes :: The same axes as Input. -->
<script lang="ts">
	import { SearchInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as variant (variant)}
		<SearchInput {variant} value="Harbor" aria-label={`${variant} search`} />
	{/each}
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<SearchInput {size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<SearchInput {shape} placeholder={`Shape ${shape}`} aria-label={`Shape ${shape}`} />
	{/each}
</div>
