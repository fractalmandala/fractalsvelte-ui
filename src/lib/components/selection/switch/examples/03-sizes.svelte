<!-- @example Sizes :: Five sizes, all on, with a change callback. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';

	let flips = $state(0);
</script>

<div class="row ycenter wrap gap-lg">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
		<Switch
			size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
			checked
			label={size}
			onCheckedChange={() => flips++}
		/>
	{/each}
</div>
<p class="text-sm text-muted tabular-nums">{flips} flips</p>
