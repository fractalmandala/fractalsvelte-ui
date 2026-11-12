<!-- @example Alpha and swatches :: alpha adds an opacity slider; swatches offer a short brand palette. -->
<script lang="ts">
	import { ColorPicker } from '@fractaldesign/fractalsvelte-ui';

	let fill = $state('rgb(37 99 235 / 0.85)');
	const swatches = [
		'#0f172a',
		'#2563eb',
		'#059669',
		'#d97706',
		'#e11d48',
		'#7c3aed',
		'#e2e8f0'
	];
</script>

<div class="box gap-sm">
	<ColorPicker bind:value={fill} format="rgb" alpha {swatches} label="Fill" />
	<p class="text-sm text-muted font-mono">{fill}</p>
</div>
