<!-- @example Tint and surface :: A tinted frost, beside the same panel on a solid fill with a squarer corner and its own inset and gap. -->
<script lang="ts">
	import { Aurora, GlassPanel } from '@fractaldesign/fractalsvelte-ui';
</script>

<Aurora class="curved pad-xl">
	<div class="grid-2 gap-bs">
		<GlassPanel tint>
			<p class="card-title">Tinted frost</p>
			<p class="card-desc text-secondary">A little of the accent mixed into the blur, over the shared glass surface.</p>
		</GlassPanel>
		<GlassPanel surface="paneled" shape="modern" pad="pad-xl" gap="gap-xs">
			<p class="card-title">Solid panel</p>
			<p class="card-desc text-secondary">The same content on an opaque panel fill, with a squarer corner.</p>
		</GlassPanel>
	</div>
</Aurora>
