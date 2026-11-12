<!-- @example Scale, blur and delay :: A scaled, slightly blurred entrance, held for a beat after it comes into view. -->
<script lang="ts">
	import { Reveal } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="scroll-menu box gap-md pad-sm">
	<p class="text-sm text-muted">Scroll to the photograph caption below.</p>
	<div class="pad-xl"></div>
	<Reveal direction="up" distance={16} scale={0.96} blur={8} delay={160} amount={0.3} spring="gentle">
		<article class="card rim shad-md pad-lg">
			<p class="text-sm text-muted">Plate 14</p>
			<p class="weight-500">The linotype bay, night shift</p>
			<p class="text-sm text-secondary">Held 160 ms, then sprung from a soft scale and an 8-pixel blur.</p>
		</article>
	</Reveal>
</div>
