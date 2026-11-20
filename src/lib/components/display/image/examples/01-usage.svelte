<!-- @example Usage :: Landscape image frame with caption and a fallback example. -->
<script lang="ts">
	import { Image } from '@fractaldesign/fractalsvelte-ui';

	const sampleSvg =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%23222b38"/><circle cx="210" cy="140" r="56" fill="%2360a5fa"/><path d="M0 360 L220 200 L380 300 L500 180 L640 360 Z" fill="%23334155"/></svg>'
		);
</script>

<div class="row wrap gap-md">
	<div class="measure-xs wfull">
		<Image
			src={sampleSvg}
			alt="Mountain silhouette at dusk"
			aspectRatio="16-9"
			shape="curved"
			caption="16:9 framed image"
		/>
	</div>
	<div class="measure-xs wfull">
		<Image alt="Preview unavailable" aspectRatio="16-9" shape="curved" />
	</div>
</div>
