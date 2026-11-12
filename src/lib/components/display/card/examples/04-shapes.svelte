<!-- @example Shapes :: The corner shape follows the shared shape ladder. -->
<script lang="ts">
	import { Card, CardContent, CardTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-bs">
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<Card {shape} size="sm" class="measure-xs">
			<CardTitle level={4}>{shape}</CardTitle>
			<CardContent>Corners from the radius ladder.</CardContent>
		</Card>
	{/each}
</div>
