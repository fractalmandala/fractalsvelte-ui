<!-- @example Usage :: The button is fixed to the viewport and appears after the page has been scrolled past the threshold; a ring around it fills with the scroll progress. -->
<script lang="ts">
	import { BackToTop } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	let size = $state<(typeof sizes)[number]>('md');
</script>

<div class="box gap-md">
	<div class="row ycenter gap-sm wrap">
		<p class="text-sm text-muted">Button size</p>
		{#each sizes as step (step)}
			<button type="button" class={['button ghost modern text-sm', size === step && 'selected']} onclick={() => (size = step)}>
				{step}
			</button>
		{/each}
	</div>
	<p class="text-body text-secondary">
		Scroll this page past the threshold to bring the button up in the bottom corner. The ring around
		it fills as you continue, and the button returns you to the top.
	</p>
	<BackToTop threshold={320} {size} label="Back to top" />
</div>
