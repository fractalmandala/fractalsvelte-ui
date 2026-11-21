<!-- @example Sizes :: Three field heights, the text scale following each one. -->
<script lang="ts">
	import { Autocomplete } from '@fractaldesign/fractalsvelte-ui';

	const depots = ['Leeds', 'Antwerp', 'Gdańsk', 'Trieste'];
</script>

<div class="box gap-sm measure-sm">
	{#each ['h-md', 'h-lg', 'h-xl'] as const as size (size)}
		<Autocomplete options={depots} {size} placeholder={`Depot — ${size}`} aria-label={`Depot, ${size}`} />
	{/each}
</div>
