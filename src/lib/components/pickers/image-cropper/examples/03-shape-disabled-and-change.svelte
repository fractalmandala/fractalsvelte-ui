<!-- @example Shape, disabled and onCropChange :: A round cutout for an avatar on its own surface, a locked cropper, and the rectangle every drag reports. -->
<script lang="ts">
	import { ImageCropper, type CropRect } from '@fractaldesign/fractalsvelte-ui';

	const portrait =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360"><rect width="360" height="360" fill="#e2e8f0"/><circle cx="180" cy="140" r="64" fill="#94a3b8"/><path d="M76 360c0-58 46-104 104-104s104 46 104 104Z" fill="#64748b"/></svg>'
		);

	let avatar = $state<CropRect>({ x: 15, y: 15, width: 70, height: 70 });
	let report = $state('Drag the selection to see the rectangle.');
</script>

<div class="row wrap gap-lg">
	<div class="measure-xs">
		<ImageCropper
			src={portrait}
			bind:crop={avatar}
			shape="round"
			surface="paneled"
			aspectRatio={1}
			alt="Portrait, circular avatar crop"
			onCropChange={(next) => (report = `${Math.round(next.width)}% × ${Math.round(next.height)}% at ${Math.round(next.x)}%, ${Math.round(next.y)}%`)}
		/>
	</div>
	<div class="measure-xs">
		<ImageCropper src={portrait} shape="round" disabled alt="Portrait, cropping locked" />
	</div>
	<p class="text-sm text-secondary tabular-nums">{report}</p>
</div>
