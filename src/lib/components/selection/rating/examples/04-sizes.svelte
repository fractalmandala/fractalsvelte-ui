<!-- @example Sizes :: Five sizes, from a compact row to a large display rating. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const;
</script>

<div class="box gap-sm">
	{#each sizes as size (size)}
		<div class="row ycenter gap-md">
			<Rating value={4} {size} label={`Quality (${size})`} />
			<span class="text-xs text-muted">{size}</span>
		</div>
	{/each}
</div>
