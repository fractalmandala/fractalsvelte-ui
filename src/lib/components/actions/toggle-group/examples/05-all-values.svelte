<!-- @example Every variant, size and shape :: The full range the group accepts, each with a realistic two-way choice. -->
<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	{#each ['primary', 'secondary', 'themed', 'soft', 'outline', 'ghost', 'link', 'info', 'success', 'warning', 'danger'] as v (v)}
		<ToggleGroup label={`Theme, ${v}`} variant={v as never} size="sm" value="light">
			<ToggleGroupItem value="light">Light</ToggleGroupItem>
			<ToggleGroupItem value="dark">Dark</ToggleGroupItem>
		</ToggleGroup>
	{/each}
	<div class="row wrap gap-sm ycenter">
		{#each ['xs', 'sm', 'md', 'lg', 'xl'] as s (s)}
			<ToggleGroup label={`Size ${s}`} size={s as never} value="a">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>
		{/each}
	</div>
	<div class="row wrap gap-sm ycenter">
		{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as sh (sh)}
			<ToggleGroup label={`Shape ${sh}`} shape={sh as never} orientation="horizontal" value="a">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>
		{/each}
	</div>
</div>
