<!-- @example Sizes :: Five sizes, all on, with a change callback. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';

	let flips = $state(0);
</script>

<div class="row ycenter wrap gap-lg">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Switch
			size={size}
			checked
			label={size}
			onCheckedChange={() => flips++}
		/>
	{/each}
</div>
<p class="text-sm text-muted tabular-nums">{flips} flips</p>
