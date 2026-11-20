<!-- @example Sizes and pulse :: Every size, and a pulsing halo on a live degraded state. -->
<script lang="ts">
	import { Status } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="row wrap ycenter gap-lg">
		<Status size="h-xs">Operational</Status>
		<Status size="h-sm">Operational</Status>
		<Status size="h-md">Operational</Status>
		<Status size="h-lg">Operational</Status>
		<Status size="h-xl">Operational</Status>
		<Status size="h-bs">Operational</Status>
		<Status size="h-2xl">Operational</Status>
		<Status size="h-3xl">Operational</Status>
	</div>
	<div class="row wrap gap-lg">
		<Status tone="success" pulse>All regions live</Status>
		<Status tone="warning" pulse>Elevated latency in eu-west-3</Status>
	</div>
</div>
