<!-- @example Pause and fade :: Edge masks, and a strip that does not pause under the pointer. -->
<script lang="ts">
	import { Marquee } from '@fractaldesign/fractalsvelte-ui';

	const quotes = [
		'The quietest invoice tool we have used.',
		'Settled into the design system in an afternoon.',
		'Springs that feel like they belong to the page.'
	];
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<p class="text-xs text-muted">fade, pauses on hover</p>
		<Marquee fade pauseOnHover speed={32} aria-label="Kind words, fading at the edges">
			{#each quotes as quote (quote)}
				<span class="text-sm text-secondary">{quote}</span>
			{/each}
		</Marquee>
	</div>
	<div class="box gap-xs">
		<p class="text-xs text-muted">pauseOnHover off</p>
		<Marquee pauseOnHover={false} fade={false} speed={44} aria-label="Kind words, always moving">
			{#each quotes as quote (quote)}
				<span class="text-sm text-secondary">{quote}</span>
			{/each}
		</Marquee>
	</div>
</div>
