<!-- @example Usage :: Monthly recurring revenue, with a delta against last month. -->
<script lang="ts">
	import { luBanknote } from '@fractaldesign/icons/lucide';
	import { Stat } from '@fractaldesign/fractalsvelte-ui';
</script>

<Stat
	label="Monthly recurring revenue"
	value={128400}
	format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
	locale="en-US"
	delta={4.2}
	deltaAs="percent"
	hint="vs last month"
	icon={luBanknote}
/>
