<!-- @example Presets :: Fade-up, blur, scale and slide on the same sentence. -->
<script lang="ts">
	import { TextReveal } from '@fractaldesign/fractalsvelte-ui';

	const presets = ['fade-up', 'blur', 'scale', 'slide'] as const;
	const text = 'The autumn catalogue is live.';
</script>

<div class="box gap-lg">
	{#each presets as preset (preset)}
		<div class="box gap-xs">
			<p class="text-xs text-muted">preset: {preset}</p>
			<TextReveal {preset} {text} class="text-lg weight-500" />
		</div>
	{/each}
</div>
