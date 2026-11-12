<!-- @example Format and locale :: Currency, a percent, and the same count in German. -->
<script lang="ts">
	import { NumberTicker } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<figure class="box gap-xs">
		<p class="text-xs text-muted">en-GB, currency</p>
		<p class="text-xl weight-500">
			<NumberTicker
				value={1840.5}
				locale="en-GB"
				format={{ style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }}
			/>
		</p>
	</figure>
	<figure class="box gap-xs">
		<p class="text-xs text-muted">percent</p>
		<p class="text-xl weight-500">
			<NumberTicker value={0.964} format={{ style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
		</p>
	</figure>
	<figure class="box gap-xs">
		<p class="text-xs text-muted">de-DE, grouping</p>
		<p class="text-xl weight-500">
			<NumberTicker value={12840} locale="de-DE" variant="slot" />
		</p>
	</figure>
</div>
