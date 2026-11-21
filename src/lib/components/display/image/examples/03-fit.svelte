<!-- @example Fit modes :: One square artwork inside a 4:3 frame under each object-fit setting. -->
<script lang="ts">
	import { Image } from '@fractaldesign/fractalsvelte-ui';

	const portraitSvg =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#1f2937"/><rect x="40" y="40" width="220" height="220" fill="none" stroke="#38bdf8" stroke-width="6"/><circle cx="150" cy="150" r="60" fill="#34d399"/></svg>'
		);
</script>

<div class="row wrap gap-md">
	{#each ['cover', 'contain', 'fill', 'scale-down'] as const as fit (fit)}
		<div class="measure-xs wfull">
			<Image
				src={portraitSvg}
				alt={`Square artwork fitted with ${fit}`}
				aspectRatio="4-3"
				{fit}
				caption={`fit: ${fit}`}
				surface="elevated"
				textSize="text-md"
				textColor="text-secondary"
				childTextSize="text-sm"
				childTextColor="text-secondary"
			/>
		</div>
	{/each}
</div>
