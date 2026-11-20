<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TimeRangeField, type TimeRange } from '@fractaldesign/fractalsvelte-ui';

	const hours: TimeRange = { start: '09:00', end: '17:30' };
</script>

<div class="box gap-sm measure-sm">
	<TimeRangeField size="h-lg" textSize="text-xs" value={hours} aria-label="Extra-small type" />
	<TimeRangeField size="h-lg" textSize="text-sm" value={hours} aria-label="Small type" />
	<TimeRangeField size="h-lg" textSize="text-md" value={hours} aria-label="Medium type" />
	<TimeRangeField size="h-lg" textSize="text-lg" value={hours} aria-label="Large type" />
	<TimeRangeField size="h-lg" textSize="text-xl" value={hours} aria-label="Extra-large type" />
</div>
