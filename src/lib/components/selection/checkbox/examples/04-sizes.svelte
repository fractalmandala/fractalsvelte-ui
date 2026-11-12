<!-- @example Sizes :: Five sizes, scaling the box and the text together. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter wrap gap-lg">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
		<Checkbox size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'} checked label={size} />
	{/each}
</div>
