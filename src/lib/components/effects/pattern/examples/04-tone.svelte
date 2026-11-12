<!-- @example Tone :: Neutral, info, success, warning and danger patterns. -->
<script lang="ts">
	import { Pattern } from '@fractaldesign/fractalsvelte-ui';

	const tones = [
		['neutral', 'Neutral', 'A quiet field that does not pull the eye.'],
		['info', 'Info', 'A cool wash, for a documentation band.'],
		['success', 'Success', 'A confirmation surface, after a deploy lands.'],
		['warning', 'Warning', 'A caution band, ahead of a breaking change.'],
		['danger', 'Danger', 'A strong field, for an incident or a destructive action.']
	] as const;
</script>

<div class="grid-2 gap-bs">
	{#each tones as [tone, title, copy] (tone)}
		<div class="relative overflow-hidden curved pad-xl box gap-sm bg-surface border-subtle">
			<Pattern variant="grid" fade="edges" {tone} />
			<p class="card-title">{title}</p>
			<p class="card-desc text-secondary">{copy}</p>
		</div>
	{/each}
</div>
