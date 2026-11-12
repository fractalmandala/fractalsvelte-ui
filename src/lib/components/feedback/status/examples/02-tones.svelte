<!-- @example Tones :: Neutral, info, success, warning and danger, each with its label. -->
<script lang="ts">
	import { Status } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-lg">
	<Status tone="neutral">Maintenance</Status>
	<Status tone="info">Deploying</Status>
	<Status tone="success">Operational</Status>
	<Status tone="warning">Degraded</Status>
	<Status tone="danger">Outage</Status>
</div>
