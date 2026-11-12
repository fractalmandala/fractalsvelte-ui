<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TimeRangeField, type TimeRange } from '@fractaldesign/fractalsvelte-ui';

	const hours: TimeRange = { start: '09:00', end: '17:30' };
</script>

<div class="box gap-sm measure-sm">
	<TimeRangeField size="lg" textSize="xs" value={hours} aria-label="Extra-small type" />
	<TimeRangeField size="lg" textSize="sm" value={hours} aria-label="Small type" />
	<TimeRangeField size="lg" textSize="md" value={hours} aria-label="Medium type" />
	<TimeRangeField size="lg" textSize="lg" value={hours} aria-label="Large type" />
	<TimeRangeField size="lg" textSize="xl" value={hours} aria-label="Extra-large type" />
</div>
