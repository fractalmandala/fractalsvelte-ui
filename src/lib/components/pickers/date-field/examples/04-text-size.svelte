<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { DateField } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<DateField size="h-lg" textSize="text-xs" value="2026-11-12" aria-label="Extra-small type" />
	<DateField size="h-lg" textSize="text-sm" value="2026-11-12" aria-label="Small type" />
	<DateField size="h-lg" textSize="text-md" value="2026-11-12" aria-label="Medium type" />
	<DateField size="h-lg" textSize="text-lg" value="2026-11-12" aria-label="Large type" />
	<DateField size="h-lg" textSize="text-xl" value="2026-11-12" aria-label="Extra-large type" />
</div>
