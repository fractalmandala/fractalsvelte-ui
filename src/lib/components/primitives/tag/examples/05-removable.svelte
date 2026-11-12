<!-- @example Removable :: A remove control on each tag. The owner takes the value out of its own list when onRemove fires. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';

	let filters = $state(['Svelte 5', 'Rust', 'Typography', 'Dark mode']);
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		{#each filters as filter (filter)}
			<Tag
				variant="secondary"
				removable
				removeLabel="Remove filter {filter}"
				onRemove={() => (filters = filters.filter((f) => f !== filter))}>{filter}</Tag
			>
		{/each}
	</div>
	<p class="text-sm text-muted tabular-nums">{filters.length} active filters</p>
</div>
