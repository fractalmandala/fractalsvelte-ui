<!-- @example Variants :: A soft tint, a hairline outline and a solid fill for the same message. -->
<script lang="ts">
	import { Alert } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Alert look="soft" tone="success" title="Deployment live">Version 2.8.1 reached all regions.</Alert>
	<Alert look="outline" tone="success" title="Deployment live">Version 2.8.1 reached all regions.</Alert>
	<Alert look="solid" tone="success" title="Deployment live">Version 2.8.1 reached all regions.</Alert>
	<Alert look="solid" tone="warning" title="Rate limited">Requests are being throttled to 60 per minute.</Alert>
	<Alert look="outline" tone="danger" title="Build failed">The type check exited with 3 errors.</Alert>
</div>
