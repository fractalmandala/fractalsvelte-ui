<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TimeField } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<TimeField size="h-lg" textSize="text-xs" value="09:30" aria-label="Extra-small type" />
	<TimeField size="h-lg" textSize="text-sm" value="09:30" aria-label="Small type" />
	<TimeField size="h-lg" textSize="text-md" value="09:30" aria-label="Medium type" />
	<TimeField size="h-lg" textSize="text-lg" value="09:30" aria-label="Large type" />
	<TimeField size="h-lg" textSize="text-xl" value="09:30" aria-label="Extra-large type" />
</div>
