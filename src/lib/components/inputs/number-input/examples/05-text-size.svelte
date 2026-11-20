<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { NumberInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-xs">
	<NumberInput size="h-lg" textSize="text-xs" value={12} aria-label="Extra-small type" />
	<NumberInput size="h-lg" textSize="text-sm" value={12} aria-label="Small type" />
	<NumberInput size="h-lg" textSize="text-md" value={12} aria-label="Medium type" />
	<NumberInput size="h-lg" textSize="text-lg" value={12} aria-label="Large type" />
	<NumberInput size="h-lg" textSize="text-xl" value={12} aria-label="Extra-large type" />
</div>
