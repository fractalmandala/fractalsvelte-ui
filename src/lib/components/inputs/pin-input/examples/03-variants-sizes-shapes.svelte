<!-- @example Variants, sizes and shapes :: The same axes as Input, on a four-digit row. -->
<script lang="ts">
	import { PinInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	{#each ['outline', 'secondary', 'ghost'] as const as variant (variant)}
		<PinInput {variant} length={4} value="2048" aria-label={`${variant} code`} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<PinInput {size} length={4} value="1847" aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<PinInput {shape} length={4} value="3910" aria-label={`Shape ${shape}`} />
	{/each}
</div>
