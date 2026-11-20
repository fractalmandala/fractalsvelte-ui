<!-- @example Sizes :: Five heights, with the text scale following. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Input {size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
	{/each}
</div>
