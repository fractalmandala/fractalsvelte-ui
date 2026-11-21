<!-- @example Surface, corner and inset :: The same glow on three surfaces, with the corner and inset ladders alongside. -->
<script lang="ts">
	import { GlowCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-3 gap-bs">
	<GlowCard surface="elevated">
		<p class="card-title">Elevated</p>
		<p class="card-desc text-secondary">The default raised fill under the travelling border.</p>
	</GlowCard>
	<GlowCard surface="paneled" shape="modern" pad="pad-xl" gap="gap-xs">
		<p class="card-title">Paneled</p>
		<p class="card-desc text-secondary">A recessed fill, a squarer corner and a tighter inset.</p>
	</GlowCard>
	<GlowCard surface="overlayed" shape="round">
		<p class="card-title">Overlayed</p>
		<p class="card-desc text-secondary">The overlay fill, a round corner and a generous inset.</p>
	</GlowCard>
</div>
