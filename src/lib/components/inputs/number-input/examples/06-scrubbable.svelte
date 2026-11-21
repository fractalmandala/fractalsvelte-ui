<!-- @example Scrubbable :: A leading grip drags the value left and right, in its own ink, for a field a designer nudges all day. -->
<script lang="ts">
	import { Field, NumberInput } from '@fractaldesign/fractalsvelte-ui';

	let width = $state<number | null>(320);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Column width" hint="Drag the grip, or hold Shift while dragging to move ten steps at a time.">
		<NumberInput bind:value={width} scrubbable min={240} max={960} step={4} precision={0} textColor="text-secondary" />
	</Field>
	<p class="text-sm text-muted tabular-nums">{width ?? '—'} px</p>
</div>
