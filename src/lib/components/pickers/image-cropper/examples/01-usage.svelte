<!-- @example Usage :: Interactive rectangle cropper displaying percentage coordinates. -->
<script lang="ts">
	import { ImageCropper, type CropRect } from '@fractaldesign/fractalsvelte-ui';

	const sampleSvg =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%231e293b"/><circle cx="320" cy="180" r="90" fill="%2338bdf8"/><path d="M0 360 L200 180 L380 280 L520 140 L640 360 Z" fill="%23475569"/></svg>'
		);

	let crop = $state<CropRect>({ x: 20, y: 15, width: 60, height: 70 });
</script>

<div class="column gap-sm measure-sm wfull">
	<ImageCropper src={sampleSvg} bind:crop alt="Landscape crop preview" />
	<p class="text-xs text-muted tabular-nums">
		x: {crop.x}%, y: {crop.y}%, {crop.width}% × {crop.height}%
	</p>
</div>
