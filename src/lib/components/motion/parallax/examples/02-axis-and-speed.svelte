<!-- @example Axis and speed :: Vertical lag, a faster vertical lead, and a horizontal drift. -->
<script lang="ts">
	import { Parallax } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<Parallax speed={0.4} axis="y" class="pad-lg bg-panel">
		<p class="text-xs text-muted">speed 0.4, axis y</p>
		<p class="text-lg weight-500">Catalogues that lag behind the scroll.</p>
	</Parallax>
	<Parallax speed={-0.25} axis="y" class="pad-lg bg-panel">
		<p class="text-xs text-muted">speed -0.25, axis y</p>
		<p class="text-lg weight-500">Signage that leads it.</p>
	</Parallax>
	<Parallax speed={0.3} axis="x" class="pad-lg bg-panel">
		<p class="text-xs text-muted">speed 0.3, axis x</p>
		<p class="text-lg weight-500">A label that drifts sideways.</p>
	</Parallax>
</div>
