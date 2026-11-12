<!-- @example Orientation :: Vertical and horizontal layouts, with a change callback. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';

	let density = $state('comfortable');
	let alignment = $state('start');
	let last = $state('');
</script>

<div class="column gap-lg">
	<RadioGroup orientation="vertical" bind:value={density} aria-label="Row density">
		<Radio value="compact" label="Compact" description="More rows on screen." />
		<Radio value="comfortable" label="Comfortable" description="Balanced spacing, the default." />
	</RadioGroup>
	<RadioGroup
		orientation="horizontal"
		bind:value={alignment}
		onValueChange={(next) => (last = next)}
		aria-label="Text alignment"
	>
		<Radio value="start" label="Start" />
		<Radio value="center" label="Center" />
		<Radio value="end" label="End" />
	</RadioGroup>
	<p class="text-sm text-muted">Last change: {last || 'none yet'}</p>
</div>
