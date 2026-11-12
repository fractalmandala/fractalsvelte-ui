<!-- @example Variants, sizes and shapes :: Every look of the field frame. -->
<script lang="ts">
	import { NativeSelect } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' }
	];
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as variant (variant)}
		<NativeSelect {variant} {options} value="draft" aria-label={`${variant} status`} />
	{/each}
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<NativeSelect {size} {options} value="draft" aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<NativeSelect {shape} {options} value="draft" aria-label={`Shape ${shape}`} />
	{/each}
</div>
