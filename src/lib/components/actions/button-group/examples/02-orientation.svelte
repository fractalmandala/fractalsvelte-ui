<!-- @example Orientation :: Run the group across or down. -->
<script lang="ts">
	import { Button, ButtonGroup } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-xl">
	<ButtonGroup label="View range" orientation="horizontal">
		<Button variant="outline" size="h-lg">Day</Button>
		<Button variant="outline" size="h-lg">Week</Button>
		<Button variant="outline" size="h-lg">Month</Button>
	</ButtonGroup>
	<ButtonGroup label="Zoom" orientation="vertical">
		<Button variant="outline" size="h-lg">Zoom in</Button>
		<Button variant="outline" size="h-lg">Reset</Button>
		<Button variant="outline" size="h-lg">Zoom out</Button>
	</ButtonGroup>
</div>
