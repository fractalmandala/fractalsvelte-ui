<!-- @example Sizes and tones :: Every size, and every tone on a row of dots. -->
<script lang="ts">
	import { Spinner } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="row ycenter wrap gap-lg">
		<Spinner size="xs" label="Loading, extra small" />
		<Spinner size="sm" label="Loading, small" />
		<Spinner size="md" label="Loading, medium" />
		<Spinner size="lg" label="Loading, large" />
		<Spinner size="xl" label="Loading, extra large" />
	</div>
	<div class="row ycenter wrap gap-lg">
		<Spinner variant="dots" tone="neutral" label="Idle" />
		<Spinner variant="dots" tone="info" label="Syncing" />
		<Spinner variant="dots" tone="success" label="Finishing" />
		<Spinner variant="dots" tone="warning" label="Retrying" />
		<Spinner variant="dots" tone="danger" label="Recovering" />
	</div>
</div>
