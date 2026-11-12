<!-- @example Directions :: Four directions, each with a different distance. Scroll the pane to replay them with once={false}. -->
<script lang="ts">
	import { Reveal } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ direction: 'up', distance: 28, title: 'From below', deck: 'The cellar archive on Fetter Lane.' },
		{ direction: 'down', distance: 28, title: 'From above', deck: 'A skylight over the composing room.' },
		{ direction: 'left', distance: 40, title: 'From the right', deck: 'The east window onto the yard.' },
		{ direction: 'right', distance: 40, title: 'From the left', deck: 'The west door onto the alley.' }
	] as const;
</script>

<div class="scroll-menu box gap-md pad-sm">
	<p class="text-sm text-muted">Scroll to reveal each dispatch, then scroll away to send it back.</p>
	<div class="pad-lg"></div>
	{#each items as item}
		<Reveal direction={item.direction} distance={item.distance} once={false} amount={0.35} spring="gentle">
			<article class="card rim shad-sm pad-md">
				<p class="text-sm text-muted">{item.title}</p>
				<p class="weight-500">{item.deck}</p>
			</article>
		</Reveal>
	{/each}
	<div class="pad-lg"></div>
</div>
