<!-- @example Vertical and disabled :: orientation switches the arrow keys to Up and Down; disabled locks every item. -->
<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-xl">
	<ToggleGroup label="Sort order" orientation="vertical" value="recent">
		<ToggleGroupItem value="recent">Most recent</ToggleGroupItem>
		<ToggleGroupItem value="name">Name</ToggleGroupItem>
		<ToggleGroupItem value="size">File size</ToggleGroupItem>
	</ToggleGroup>
	<ToggleGroup label="Plan (managed by your admin)" disabled value="team">
		<ToggleGroupItem value="solo">Solo</ToggleGroupItem>
		<ToggleGroupItem value="team">Team</ToggleGroupItem>
	</ToggleGroup>
</div>
