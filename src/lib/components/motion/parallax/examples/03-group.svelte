<!-- @example Group :: A short scene of three layers, stacked in a clipped frame. -->
<script lang="ts">
	import { Parallax, ParallaxGroup } from '@fractaldesign/fractalsvelte-ui';
</script>

<ParallaxGroup class="h-3xl bg-panel">
	<Parallax speed={0.15} class="cover pad-xl">
		<p class="text-xs text-muted">Background, speed 0.15</p>
		<p class="text-3xl weight-600 text-muted">HOLDWORTH</p>
	</Parallax>
	<Parallax speed={0.35} class="cover pad-xl">
		<p class="text-xl weight-500">Unit 4, the Greenwich workshop.</p>
		<p class="text-sm text-secondary">Type, catalogues and wayfinding for cultural spaces.</p>
	</Parallax>
	<Parallax speed={0.55} class="cover pad-xl">
		<span class="tag">Est. 2008</span>
	</Parallax>
</ParallaxGroup>
