<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { DateField } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<DateField size="lg" textSize="xs" value="2026-11-12" aria-label="Extra-small type" />
	<DateField size="lg" textSize="sm" value="2026-11-12" aria-label="Small type" />
	<DateField size="lg" textSize="md" value="2026-11-12" aria-label="Medium type" />
	<DateField size="lg" textSize="lg" value="2026-11-12" aria-label="Large type" />
	<DateField size="lg" textSize="xl" value="2026-11-12" aria-label="Extra-large type" />
</div>
