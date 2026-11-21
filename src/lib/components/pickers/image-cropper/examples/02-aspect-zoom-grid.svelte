<!-- @example Aspect ratio, zoom and grid :: aspectRatio locks the selection to 16:9, zoom magnifies the image under it, and grid={false} clears the thirds. -->
<script lang="ts">
	import { ImageCropper, type CropRect } from '@fractaldesign/fractalsvelte-ui';

	const harbour =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#0f172a"/><rect y="240" width="640" height="120" fill="#1e3a5f"/><circle cx="520" cy="80" r="42" fill="#fbbf24"/><path d="M0 240 L160 150 L300 240 Z" fill="#334155"/><path d="M240 240 L400 120 L560 240 Z" fill="#475569"/></svg>'
		);

	let banner = $state<CropRect>({ x: 8, y: 10, width: 84, height: 47 });
</script>

<div class="box gap-lg measure-sm">
	<ImageCropper src={harbour} bind:crop={banner} aspectRatio={16 / 9} alt="Harbour at dusk, 16:9 banner crop" />
	<ImageCropper src={harbour} zoom={1.6} grid={false} alt="Harbour at dusk, magnified without the grid" />
</div>
