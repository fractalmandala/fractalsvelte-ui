<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TimeField } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<TimeField size="lg" textSize="xs" value="09:30" aria-label="Extra-small type" />
	<TimeField size="lg" textSize="sm" value="09:30" aria-label="Small type" />
	<TimeField size="lg" textSize="md" value="09:30" aria-label="Medium type" />
	<TimeField size="lg" textSize="lg" value="09:30" aria-label="Large type" />
	<TimeField size="lg" textSize="xl" value="09:30" aria-label="Extra-large type" />
</div>
