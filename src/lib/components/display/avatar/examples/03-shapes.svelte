<!-- @example Shapes :: A circle, a rounded square and a square. -->
<script lang="ts">
	import { Avatar } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter gap-lg">
	{#each ['circle', 'rounded', 'square'] as const as shape}
		<div class="box xcenter gap-xs">
			<Avatar name="Priya Shah" {shape} size="lg" />
			<span class="text-xs text-muted">{shape}</span>
		</div>
	{/each}
</div>
