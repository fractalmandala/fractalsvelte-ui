<!-- @example Appearance :: variant, size and shape flow to every item; attached={false} separates them. -->
<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<ToggleGroup label="Billing period" variant="soft" size="sm" shape="round" value="yearly">
		<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
		<ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
	</ToggleGroup>
	<ToggleGroup label="Density" variant="secondary" size="lg" shape="curved" value="comfortable" attached={false}>
		<ToggleGroupItem value="compact">Compact</ToggleGroupItem>
		<ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
		<ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
	</ToggleGroup>
</div>
