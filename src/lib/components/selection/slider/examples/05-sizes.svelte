<!-- @example Sizes :: Five sizes of track and thumb. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="measure-sm column gap-sm">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Slider size={size} value={55} label={`Size ${size}`} />
	{/each}
</div>
