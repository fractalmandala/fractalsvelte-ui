<!-- @example Element target and tones :: An article that fills a bar as it passes, in every tone. -->
<script lang="ts">
	import { ScrollProgress } from '@fractaldesign/fractalsvelte-ui';

	const tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
</script>

<div class="box gap-lg">
	<ScrollProgress variant="bar" position="top" target="element" tone="info">
		<article class="box gap-sm pad-lg bg-panel">
			<h3 class="text-lg weight-500">From the autumn catalogue</h3>
			<p class="text-sm text-secondary">
				The workshop on Holdsworth Street spent the summer cutting a new display face for the river museum. The
				brief was a quiet inscription, something that would sit on glass and stone without raising its voice, and
				that would still read from the far bank at dusk.
			</p>
			<p class="text-sm text-secondary">
				We drew it in the evenings, with the tide under the window, and proofed it on newsprint first — a cheap
				way to see whether the hairlines held. They did. The museum takes the first cut in November.
			</p>
			<p class="text-sm text-secondary">
				A short article, on purpose: as it enters and leaves the viewport the bar above fills and empties with
				its passage, rather than with the page as a whole.
			</p>
		</article>
	</ScrollProgress>
	<div class="row gap-md wrap ycenter">
		{#each tones as tone (tone)}
			<div class="box gap-xs xcenter">
				<p class="text-xs text-muted">{tone}</p>
				<ScrollProgress variant="ring" target="page" {tone} />
			</div>
		{/each}
	</div>
</div>
