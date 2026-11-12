<!-- @example Tint, border and rim :: A tinted panel, and one with the hairline and rim turned off. -->
<script lang="ts">
	import { Aurora, GlassPanel } from '@fractaldesign/fractalsvelte-ui';
</script>

<Aurora class="curved pad-xl">
	<div class="grid-2 gap-bs">
		<GlassPanel tint border rim>
			<p class="card-title">Tinted, bordered, rimmed</p>
			<p class="card-desc text-secondary">A little of the accent in the frost, with a hairline and a lit edge.</p>
		</GlassPanel>
		<GlassPanel tint={false} border={false} rim={false}>
			<p class="card-title">Frost only</p>
			<p class="card-desc text-secondary">No tint, no hairline, no rim — just the backdrop blur.</p>
		</GlassPanel>
	</div>
</Aurora>
