<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { DateRangeField, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	const period: DateRange = { start: '2026-11-01', end: '2026-11-12' };
</script>

<div class="box gap-sm measure-sm">
	<DateRangeField size="h-lg" textSize="text-xs" value={period} aria-label="Extra-small type" />
	<DateRangeField size="h-lg" textSize="text-sm" value={period} aria-label="Small type" />
	<DateRangeField size="h-lg" textSize="text-md" value={period} aria-label="Medium type" />
	<DateRangeField size="h-lg" textSize="text-lg" value={period} aria-label="Large type" />
	<DateRangeField size="h-lg" textSize="text-xl" value={period} aria-label="Extra-large type" />
</div>
