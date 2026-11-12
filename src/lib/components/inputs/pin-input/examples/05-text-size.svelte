<!-- @example Text size :: The text scale can be set independently of the cell height. -->
<script lang="ts">
	import { PinInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<PinInput size="lg" textSize="xs" value="123456" aria-label="Extra-small type" />
	<PinInput size="lg" textSize="sm" value="123456" aria-label="Small type" />
	<PinInput size="lg" textSize="md" value="123456" aria-label="Medium type" />
	<PinInput size="lg" textSize="lg" value="123456" aria-label="Large type" />
	<PinInput size="lg" textSize="xl" value="123456" aria-label="Extra-large type" />
</div>
