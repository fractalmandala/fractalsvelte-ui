<!-- @example Tones :: Neutral, info, success, warning and danger, each with its default icon. -->
<script lang="ts">
	import { Banner } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Banner tone="neutral" title="Draft saved">Your changelog edits are stored locally until you publish.</Banner>
	<Banner tone="info" title="New region">eu-west-3 is accepting deployments from today.</Banner>
	<Banner tone="success" title="Domain verified">atlas.studio is now serving traffic over HTTPS.</Banner>
	<Banner tone="warning" title="Approaching your limit">You have used 91% of this month's build minutes.</Banner>
	<Banner tone="danger" title="Payment failed">We could not charge the card ending in 4242. Update it to keep your plan.</Banner>
</div>
