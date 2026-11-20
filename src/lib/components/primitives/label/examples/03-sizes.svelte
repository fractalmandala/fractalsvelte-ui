<!-- @example Sizes :: Every step of the text ladder. Match the label to the control it names. -->
<script lang="ts">
	import { Label } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const;
</script>

<div class="box gap-sm">
	{#each sizes as size (size)}
		<Label {size} for={`size-${size}`}>{size} label</Label>
	{/each}
</div>
