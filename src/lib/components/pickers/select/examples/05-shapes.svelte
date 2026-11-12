<!-- @example Shapes :: The corner shape of the field, from square to pill. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
	const sorts = [
		{ value: 'newest', label: 'Newest first' },
		{ value: 'oldest', label: 'Oldest first' },
		{ value: 'popular', label: 'Most starred' }
	];
</script>

<div class="box gap-sm measure-xs">
	{#each shapes as shape (shape)}
		<Select options={sorts} value="newest" {shape} aria-label={`Sort (${shape})`} />
	{/each}
</div>
