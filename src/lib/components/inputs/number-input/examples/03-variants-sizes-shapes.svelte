<!-- @example Variants, sizes and shapes :: The same axes as Input. -->
<script lang="ts">
	import { NumberInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'filled', 'ghost'] as const as variant (variant)}
		<NumberInput {variant} value={24} aria-label={`${variant} quantity`} />
	{/each}
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<NumberInput {size} value={8} aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<NumberInput {shape} value={3} aria-label={`Shape ${shape}`} />
	{/each}
</div>
