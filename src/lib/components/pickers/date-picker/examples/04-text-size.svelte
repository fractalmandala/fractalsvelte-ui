<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { DatePicker } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<DatePicker size="lg" textSize="xs" value="2026-11-12" aria-label="Extra-small type" />
	<DatePicker size="lg" textSize="sm" value="2026-11-12" aria-label="Small type" />
	<DatePicker size="lg" textSize="md" value="2026-11-12" aria-label="Medium type" />
	<DatePicker size="lg" textSize="lg" value="2026-11-12" aria-label="Large type" />
	<DatePicker size="lg" textSize="xl" value="2026-11-12" aria-label="Extra-large type" />
</div>
