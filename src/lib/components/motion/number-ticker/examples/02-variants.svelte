<!-- @example Variants :: A plain count beside rolling slot columns. -->
<script lang="ts">
	import { NumberTicker } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row gap-xl wrap">
	<figure class="box gap-xs">
		<p class="text-xs text-muted">variant: count</p>
		<p class="text-2xl weight-600">
			<NumberTicker variant="count" value={12840} />
		</p>
		<p class="text-sm text-secondary">People on the waitlist</p>
	</figure>
	<figure class="box gap-xs">
		<p class="text-xs text-muted">variant: slot</p>
		<p class="text-2xl weight-600">
			<NumberTicker variant="slot" value={12840} />
		</p>
		<p class="text-sm text-secondary">People on the waitlist</p>
	</figure>
</div>
