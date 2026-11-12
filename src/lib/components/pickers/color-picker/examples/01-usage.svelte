<!-- @example Usage :: A saturation-brightness area and hue slider bound to a CSS colour. -->
<script lang="ts">
	import { ColorPicker } from '@fractaldesign/fractalsvelte-ui';

	let accent = $state('#2563eb');
</script>

<div class="box gap-sm">
	<ColorPicker bind:value={accent} format="hex" label="Brand accent" />
	<p class="text-sm text-muted font-mono">{accent}</p>
</div>
