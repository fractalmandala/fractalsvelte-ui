<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { NumberInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<NumberInput size="lg" textSize="xs" value={12} aria-label="Extra-small type" />
	<NumberInput size="lg" textSize="sm" value={12} aria-label="Small type" />
	<NumberInput size="lg" textSize="md" value={12} aria-label="Medium type" />
	<NumberInput size="lg" textSize="lg" value={12} aria-label="Large type" />
	<NumberInput size="lg" textSize="xl" value={12} aria-label="Extra-large type" />
</div>
