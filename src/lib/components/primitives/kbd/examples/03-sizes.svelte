<!-- @example Sizes :: Every step of the control height ladder. Match the caps to the text they sit in. -->
<script lang="ts">
	import { Kbd } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const;
</script>

<div class="row wrap ycenter gap-sm">
	{#each sizes as size (size)}
		<Kbd {size} keys={['mod', 'P']} />
	{/each}
</div>
