<!-- @example Shapes :: A circle, a rounded square and a square. -->
<script lang="ts">
	import { Avatar } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter gap-lg">
	{#each ['round', 'curved', 'rect'] as const as shape}
		<div class="box xcenter gap-xs">
			<Avatar name="Priya Shah" {shape} size="h-lg" />
			<span class="text-xs text-muted">{shape}</span>
		</div>
	{/each}
</div>
