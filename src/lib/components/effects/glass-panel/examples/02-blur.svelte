<!-- @example Blur :: Small, medium and large frost over the same aurora. -->
<script lang="ts">
	import { Aurora, GlassPanel } from '@fractaldesign/fractalsvelte-ui';
</script>

<Aurora class="curved pad-xl">
	<div class="grid-3 gap-bs">
		<GlassPanel blur="sm">
			<p class="card-title">Small</p>
			<p class="card-desc text-secondary">A light frost, so more of the field shows through.</p>
		</GlassPanel>
		<GlassPanel blur="md">
			<p class="card-title">Medium</p>
			<p class="card-desc text-secondary">The default, balanced against the background.</p>
		</GlassPanel>
		<GlassPanel blur="lg">
			<p class="card-title">Large</p>
			<p class="card-desc text-secondary">A heavier frost, for a panel that should feel more solid.</p>
		</GlassPanel>
	</div>
</Aurora>
