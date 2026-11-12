<!-- @example Sizes and pulse :: Every size, and a pulsing halo on a live degraded state. -->
<script lang="ts">
	import { Status } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="row wrap ycenter gap-lg">
		<Status size="xs">Operational</Status>
		<Status size="sm">Operational</Status>
		<Status size="md">Operational</Status>
		<Status size="lg">Operational</Status>
		<Status size="xl">Operational</Status>
	</div>
	<div class="row wrap gap-lg">
		<Status tone="success" pulse>All regions live</Status>
		<Status tone="warning" pulse>Elevated latency in eu-west-3</Status>
	</div>
</div>
