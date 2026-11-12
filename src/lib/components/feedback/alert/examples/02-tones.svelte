<!-- @example Tones :: Neutral, info, success, warning and danger, each with its default icon. -->
<script lang="ts">
	import { Alert } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Alert tone="neutral" title="Draft saved">Your changes are stored locally until you publish.</Alert>
	<Alert tone="info" title="New dashboard">Usage reports now refresh every five minutes.</Alert>
	<Alert tone="success" title="Domain verified">atlas.studio is now serving traffic over HTTPS.</Alert>
	<Alert tone="warning" title="Approaching your limit">You have used 91% of this month's build minutes.</Alert>
	<Alert tone="danger" title="Payment failed">We could not charge the card ending in 4242. Update it to keep your plan.</Alert>
</div>
