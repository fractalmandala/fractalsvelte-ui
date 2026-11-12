<!-- @example Sizes :: Every size of every variant. -->
<script lang="ts">
	import { ModeToggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-md">
	{#each ['icon', 'switch', 'segmented'] as const as variant (variant)}
		<div class="row wrap ycenter gap-md">
			{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
				<ModeToggle {variant} {size} />
			{/each}
		</div>
	{/each}
</div>
