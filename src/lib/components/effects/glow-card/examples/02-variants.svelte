<!-- @example Variants :: Theme, rainbow and subtle rotating borders, always on. -->
<script lang="ts">
	import { GlowCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-3 gap-bs">
	<GlowCard variant="theme" active>
		<p class="card-title">Theme</p>
		<p class="card-desc text-secondary">The accent and its lighter step travel around the edge.</p>
	</GlowCard>
	<GlowCard variant="rainbow" active>
		<p class="card-title">Rainbow</p>
		<p class="card-desc text-secondary">Hues walk around the current theme hue, at the same chroma.</p>
	</GlowCard>
	<GlowCard variant="subtle" active>
		<p class="card-title">Subtle</p>
		<p class="card-desc text-secondary">A quieter wash, for cards that should almost not glow.</p>
	</GlowCard>
</div>
