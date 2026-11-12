<!-- @example Glare, max, scale and spring :: A stronger tilt with a moving glare, and a quieter card beside it. -->
<script lang="ts">
	import { TiltCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-lg">
	<TiltCard class="card rim shad-lg pad-lg measure-sm" max={16} scale={1.04} glare spring="snappy">
		<p class="text-sm text-muted">With glare</p>
		<p class="weight-500">Vol. 12, No. 4</p>
		<p class="text-sm text-secondary">Move the pointer across the cover to see the highlight travel.</p>
	</TiltCard>
	<TiltCard class="card rim shad-md pad-lg measure-sm" max={6} scale={1.01} glare={false} spring="gentle">
		<p class="text-sm text-muted">A quieter tilt</p>
		<p class="weight-500">The typographic appendix</p>
		<p class="text-sm text-secondary">A smaller angle, no glare, a gentler spring.</p>
	</TiltCard>
</div>
