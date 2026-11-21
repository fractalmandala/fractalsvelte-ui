<!-- @example Axis, bounds, snap-back and momentum :: Horizontal in a tray, vertical with snap-back, and a free card with no momentum. -->
<script lang="ts">
	import { Draggable } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="relative rim pad-lg overflow-hidden">
		<p class="text-sm text-muted">axis="x", bounds="parent"</p>
		<Draggable axis="x" bounds="parent" class="rim shad-sm pad-sm">
			<span class="text-sm weight-500">Slide along the tray</span>
		</Draggable>
	</div>
	<div class="relative rim pad-lg overflow-hidden">
		<p class="text-sm text-muted">axis="y", snapBack</p>
		<Draggable axis="y" bounds="parent" snapBack class="rim shad-sm pad-sm">
			<span class="text-sm weight-500">Pull down and release</span>
		</Draggable>
	</div>
	<Draggable axis="both" momentum={false} elastic={0.15} spring="bouncy" class="rim shad-sm pad-sm">
		<span class="text-sm weight-500">Free, no momentum</span>
	</Draggable>
</div>
