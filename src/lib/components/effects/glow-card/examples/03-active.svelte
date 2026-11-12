<!-- @example Active :: Always rotating, beside a card that waits for hover. -->
<script lang="ts">
	import { GlowCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs">
	<GlowCard active speed={6}>
		<p class="card-title">Always on</p>
		<p class="card-desc text-secondary">The border travels on its own, a little faster than the default.</p>
	</GlowCard>
	<GlowCard active={false} speed={12}>
		<p class="card-title">On hover</p>
		<p class="card-desc text-secondary">The border waits, then turns slowly when you point at it.</p>
	</GlowCard>
</div>
