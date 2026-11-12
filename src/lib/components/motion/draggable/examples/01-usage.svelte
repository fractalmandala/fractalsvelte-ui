<!-- @example Usage :: Drag the note, or focus it and nudge it with the arrow keys. -->
<script lang="ts">
	import { Draggable } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="relative pad-xl">
	<Draggable class="card rim shad-md pad-md measure-sm">
		<p class="weight-500">Proof this caption</p>
		<p class="text-sm text-secondary">Drag it off the crop, or tab to it and use the arrows.</p>
	</Draggable>
</div>
