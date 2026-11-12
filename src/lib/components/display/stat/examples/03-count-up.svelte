<!-- @example Count up :: The figure springs from zero the first time it is in view. -->
<script lang="ts">
	import { luActivity } from '@fractaldesign/icons/lucide';
	import { Stat } from '@fractaldesign/fractalsvelte-ui';
</script>

<Stat
	label="Requests this month"
	value={2846590}
	format={{ notation: 'compact', maximumFractionDigits: 1 }}
	countUp={true}
	delta={18.6}
	hint="Across all production regions"
	icon={luActivity}
/>
