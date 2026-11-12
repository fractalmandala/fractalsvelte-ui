<!-- @example Sizes :: Five sizes, from a compact filter row to a large chip set. -->
<script lang="ts">
	import { ChipGroup } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'mine', label: 'Assigned to me' },
		{ value: 'open', label: 'Open' }
	];
</script>

<div class="box gap-md">
	{#each sizes as size (size)}
		<div class="box gap-xs">
			<span class="text-xs text-muted">{size}</span>
			<ChipGroup {options} value="mine" {size} label={`Issues (${size})`} />
		</div>
	{/each}
</div>
