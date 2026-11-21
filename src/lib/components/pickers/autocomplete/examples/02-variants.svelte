<!-- @example Frames and list :: Outline, secondary and ghost frames with curved corners, and a suggestion list on a panel with quieter secondary text. -->
<script lang="ts">
	import { Autocomplete } from '@fractaldesign/fractalsvelte-ui';

	const ports = ['Rotterdam', 'Singapore', 'Valparaíso', 'Tema', 'Busan'];
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'secondary', 'ghost'] as const as variant (variant)}
		<Autocomplete
			{variant}
			options={ports}
			size="h-xl"
			shape="curved"
			textSize="text-lg"
			placeholder={`Load port — ${variant}`}
			aria-label={`Load port, ${variant} frame`}
		/>
	{/each}
	<Autocomplete
		options={ports}
		size="h-xl"
		shape="curved"
		textSize="text-lg"
		surface="paneled"
		childTextSize="text-sm"
		childTextColor="text-secondary"
		placeholder="Load port — paneled list"
		aria-label="Load port, paneled list"
	/>
</div>
