<!-- @example Sizes :: Every size of every form. -->
<script lang="ts">
	import { ModeToggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-md">
	{#each ['icon', 'switch', 'segmented'] as const as form (form)}
		<div class="row wrap ycenter gap-md">
			{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
				<ModeToggle {form} {size} />
			{/each}
		</div>
	{/each}
</div>
