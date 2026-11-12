<!-- @example Loaded :: The placeholder cross-fades to the real content when loaded is set. -->
<script lang="ts">
	import { Skeleton, Button } from '@fractaldesign/fractalsvelte-ui';

	let loaded = $state(false);
</script>

<div class="box gap-md measure-sm">
	<Button size="sm" variant="secondary" onclick={() => (loaded = !loaded)}>
		{loaded ? 'Show placeholder' : 'Reveal article'}
	</Button>
	<Skeleton {loaded} lines={3}>
		<div class="box gap-xs">
			<p class="weight-600">Usage reports now refresh every five minutes</p>
			<p class="text-sm text-secondary">
				Custom ranges go back 90 days, and exported CSV files include the new region column.
			</p>
		</div>
	</Skeleton>
</div>
