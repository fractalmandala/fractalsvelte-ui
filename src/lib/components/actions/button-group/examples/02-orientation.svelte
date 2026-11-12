<!-- @example Orientation :: Run the group across or down. -->
<script lang="ts">
	import { Button, ButtonGroup } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-xl">
	<ButtonGroup label="View range" orientation="horizontal">
		<Button variant="outline" size="sm">Day</Button>
		<Button variant="outline" size="sm">Week</Button>
		<Button variant="outline" size="sm">Month</Button>
	</ButtonGroup>
	<ButtonGroup label="Zoom" orientation="vertical">
		<Button variant="outline" size="sm">Zoom in</Button>
		<Button variant="outline" size="sm">Reset</Button>
		<Button variant="outline" size="sm">Zoom out</Button>
	</ButtonGroup>
</div>
