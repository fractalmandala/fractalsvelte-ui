<!-- @example Prefix, suffix and start on view :: Units around the number, and a ticker that waits until it is on screen. -->
<script lang="ts">
	import { NumberTicker } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<figure class="box gap-xs">
		<p class="text-sm text-muted">Average delivery time</p>
		<p class="text-2xl weight-600">
			<NumberTicker value={14} prefix="~" suffix=" days" />
		</p>
	</figure>
	<figure class="box gap-xs">
		<p class="text-sm text-muted">Uptime this quarter (starts when in view)</p>
		<p class="text-2xl weight-600">
			<NumberTicker value={99.98} suffix="%" startOnView format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
		</p>
	</figure>
</div>
