<!-- @example Variants, sizes and shapes :: Every look of the field frame. -->
<script lang="ts">
	import { NativeSelect } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' }
	];
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as look (look)}
		<NativeSelect {look} {options} value="draft" aria-label={`${look} status`} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<NativeSelect {size} {options} value="draft" aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<NativeSelect {shape} {options} value="draft" aria-label={`Shape ${shape}`} />
	{/each}
</div>
