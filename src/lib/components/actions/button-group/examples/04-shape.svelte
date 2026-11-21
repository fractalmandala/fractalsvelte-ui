<!-- @example Group shape :: The shape on the group rounds the whole joined control, from a square edge to a pill. -->
<script lang="ts">
	import { Button, ButtonGroup } from '@fractaldesign/fractalsvelte-ui';

	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
</script>

<div class="row wrap gap-lg ycenter">
	{#each shapes as shape (shape)}
		<ButtonGroup label="Time range" {shape}>
			<Button variant="outline">Day</Button>
			<Button variant="outline">Week</Button>
		</ButtonGroup>
	{/each}
</div>
