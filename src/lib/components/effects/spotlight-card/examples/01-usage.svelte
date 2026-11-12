<!-- @example Usage :: A pricing card whose surface and border light follow the pointer. -->
<script lang="ts">
	import { Button, SpotlightCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<SpotlightCard class="measure-sm">
	<p class="text-sm text-muted">Studio</p>
	<p class="page-heading-xl">$24 <span class="text-sm text-secondary weight-400">/ month</span></p>
	<p class="text-body-sm text-secondary">For a small team shipping a single product. Includes preview deploys, logs and 50 GB of bandwidth.</p>
	<Button class="mt-md">Start a trial</Button>
</SpotlightCard>
