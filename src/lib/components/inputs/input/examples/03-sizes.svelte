<!-- @example Sizes :: Five heights, with the text scale following. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<Input {size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
	{/each}
</div>
