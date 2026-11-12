<!-- @example Hover, press and focus :: Layered states: the card lifts on hover, presses on click, and scales slightly when focused. -->
<script lang="ts">
	import { Motion } from '@fractaldesign/fractalsvelte-ui';
</script>

<Motion
	as="div"
	class="card rim shad-md pad-lg measure-sm"
	tabindex={0}
	initial={{ y: 0, scale: 1 }}
	animate={{ y: 0, scale: 1 }}
	whileHover={{ y: -6, scale: 1.02 }}
	whilePress={{ scale: 0.97 }}
	whileFocus={{ scale: 1.03 }}
	spring="snappy"
>
	<p class="text-sm text-muted">Essay</p>
	<p class="weight-500">Why newsrooms still proof on paper</p>
	<p class="text-sm text-secondary">Hover, click, or tab to this card to feel each state layer on top of the last.</p>
</Motion>
