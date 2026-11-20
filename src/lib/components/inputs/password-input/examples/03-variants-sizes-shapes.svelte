<!-- @example Variants, sizes and shapes :: The same axes as Input. -->
<script lang="ts">
	import { PasswordInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as look (look)}
		<PasswordInput {look} value="harbor-1847" aria-label={`${look} password`} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<PasswordInput {size} value="harbor-1847" aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<PasswordInput {shape} value="harbor-1847" aria-label={`Shape ${shape}`} />
	{/each}
</div>
