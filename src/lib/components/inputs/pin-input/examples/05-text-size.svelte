<!-- @example Text size :: The text scale can be set independently of the cell height. -->
<script lang="ts">
	import { PinInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<PinInput size="h-lg" textSize="text-xs" value="123456" aria-label="Extra-small type" />
	<PinInput size="h-lg" textSize="text-sm" value="123456" aria-label="Small type" />
	<PinInput size="h-lg" textSize="text-md" value="123456" aria-label="Medium type" />
	<PinInput size="h-lg" textSize="text-lg" value="123456" aria-label="Large type" />
	<PinInput size="h-lg" textSize="text-xl" value="123456" aria-label="Extra-large type" />
</div>
