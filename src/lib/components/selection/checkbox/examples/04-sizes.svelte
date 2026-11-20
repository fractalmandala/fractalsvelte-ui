<!-- @example Sizes :: Five sizes, scaling the box and the text together. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter wrap gap-lg">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Checkbox size={size} checked label={size} />
	{/each}
</div>
