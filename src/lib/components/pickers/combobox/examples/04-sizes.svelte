<!-- @example Sizes and shapes :: Five sizes and five corner shapes, matching the select and the input. -->
<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
	const cities = [
		{ value: 'lisbon', label: 'Lisbon' },
		{ value: 'kyoto', label: 'Kyoto' },
		{ value: 'montreal', label: 'Montreal' }
	];
</script>

<div class="box gap-lg">
	<div class="box gap-sm measure-xs">
		{#each sizes as size (size)}
			<Combobox options={cities} value="lisbon" inputValue="Lisbon" {size} aria-label={`City (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-xs">
		{#each shapes as shape (shape)}
			<Combobox options={cities} value="kyoto" inputValue="Kyoto" {shape} aria-label={`City (${shape})`} />
		{/each}
	</div>
</div>
