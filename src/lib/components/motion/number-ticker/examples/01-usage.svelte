<!-- @example Usage :: Annual recurring revenue, counting up on a spring. -->
<script lang="ts">
	import { NumberTicker } from '@fractaldesign/fractalsvelte-ui';
</script>

<figure class="box gap-xs">
	<p class="text-sm text-muted">Annual recurring revenue</p>
	<p class="text-3xl weight-600 tabular-nums">
		<NumberTicker value={2400000} format={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} />
	</p>
</figure>
