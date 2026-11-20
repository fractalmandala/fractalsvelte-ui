<!-- @example Sizes :: Five sizes, matching buttons and inputs of the same size. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const;
	const options = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'list', label: 'List' }
	];
</script>

<div class="box gap-sm">
	{#each sizes as size (size)}
		<div class="row ycenter gap-md">
			<SegmentedControl {options} value="grid" {size} label={`Layout (${size})`} />
			<span class="text-xs text-muted">{size}</span>
		</div>
	{/each}
</div>
