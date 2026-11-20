<!-- @example Sizes and tones :: Every size, and every tone on a row of dots. -->
<script lang="ts">
	import { Spinner } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="row ycenter wrap gap-lg">
		<Spinner size="h-xs" label="Loading, extra small" />
		<Spinner size="h-sm" label="Loading, small" />
		<Spinner size="h-md" label="Loading, medium" />
		<Spinner size="h-lg" label="Loading, large" />
		<Spinner size="h-xl" label="Loading, extra large" />
		<Spinner size="h-bs" label="Loading, base" />
		<Spinner size="h-2xl" label="Loading, 2x large" />
		<Spinner size="h-3xl" label="Loading, 3x large" />
	</div>
	<div class="row ycenter wrap gap-lg">
		<Spinner form="dots" tone="neutral" label="Idle" />
		<Spinner form="dots" tone="info" label="Syncing" />
		<Spinner form="dots" tone="success" label="Finishing" />
		<Spinner form="dots" tone="warning" label="Retrying" />
		<Spinner form="dots" tone="danger" label="Recovering" />
	</div>
</div>
