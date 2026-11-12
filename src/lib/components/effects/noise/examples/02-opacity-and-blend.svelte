<!-- @example Opacity and blend :: Overlay, soft-light and multiply grains at different strengths. -->
<script lang="ts">
	import { Noise } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-3 gap-bs">
	<div class="relative overflow-hidden curved pad-xl box gap-sm bg-panel">
		<Noise opacity={0.12} blend="overlay" />
		<p class="card-title">Overlay, quiet</p>
		<p class="card-desc text-secondary">A light grain, mixed with overlay so it sits on the surface.</p>
	</div>
	<div class="relative overflow-hidden curved pad-xl box gap-sm bg-panel">
		<Noise opacity={0.28} blend="soft-light" />
		<p class="card-title">Soft light</p>
		<p class="card-desc text-secondary">A softer mix, a little stronger, for a printed-page feel.</p>
	</div>
	<div class="relative overflow-hidden curved pad-xl box gap-sm bg-surface">
		<Noise opacity={0.2} blend="multiply" />
		<p class="card-title">Multiply</p>
		<p class="card-desc text-secondary">A darker grain, useful on a light surface.</p>
	</div>
</div>
