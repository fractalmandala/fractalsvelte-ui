<!-- @example Sizes :: Five sizes of track and thumb. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="measure-sm column gap-sm">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
		<Slider size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'} value={55} label={`Size ${size}`} />
	{/each}
</div>
