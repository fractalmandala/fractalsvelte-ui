<!-- @example Sizes :: Every step of the control height ladder. Match the badge to the text beside it. -->
<script lang="ts">
	import { Badge } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const;
</script>

<div class="row wrap ycenter gap-sm">
	{#each sizes as size (size)}
		<Badge {size} variant="themed">md</Badge>
	{/each}
</div>
