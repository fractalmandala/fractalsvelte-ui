<!-- @example Aspect ratios :: Every frame the component accepts, from a square crop to a 21:9 panorama, with the caption gap set on each. -->
<script lang="ts">
	import { Image } from '@fractaldesign/fractalsvelte-ui';

	const sampleSvg =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#222b38"/><circle cx="210" cy="140" r="56" fill="#60a5fa"/><path d="M0 360 L220 200 L380 300 L500 180 L640 360 Z" fill="#334155"/></svg>'
		);
</script>

<div class="row wrap gap-md">
	{#each ['1-1', '16-9', '4-3', '3-2', '21-9'] as const as aspectRatio (aspectRatio)}
		<div class="measure-xs wfull">
			<Image src={sampleSvg} alt={`Fjord at dusk, ${aspectRatio} frame`} {aspectRatio} gap="gap-sm" caption={aspectRatio} />
		</div>
	{/each}
</div>
