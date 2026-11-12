<!-- @example Delay and in view :: A delayed entrance, and a second block that only springs in once it is scrolled into view. -->
<script lang="ts">
	import { Motion } from '@fractaldesign/fractalsvelte-ui';

	let ended = $state(0);
</script>

<div class="box gap-md">
	<Motion
		as="article"
		class="card rim shad-md pad-lg"
		initial={{ y: 20, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		spring="gentle"
		delay={240}
		onAnimationEnd={() => (ended += 1)}
	>
		<p class="text-sm text-muted">Held 240 ms, then sprung in</p>
		<p class="weight-500">The Tuesday leader column</p>
		<p class="text-sm text-secondary">{ended === 0 ? 'The spring is still running.' : 'The spring has settled.'}</p>
	</Motion>
	<div class="scroll-menu pad-sm box gap-md">
		<p class="text-sm text-muted">Scroll inside this pane.</p>
		<div class="pad-xl"></div>
		<Motion
			as="article"
			class="card rim shad-md pad-lg"
			initial={{ y: 28, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			whileInView={{ y: 0, opacity: 1, scale: 1 }}
			spring="gentle"
		>
			<p class="text-sm text-muted">In view</p>
			<p class="weight-500">A footnote on hot-metal type</p>
		</Motion>
	</div>
	<ul class="box gap-xs">
		<Motion as="li" animate={{ opacity: 1 }} initial={{ opacity: 0 }} delay={80}>
			<span class="text-sm">A list item also springs, via as="li".</span>
		</Motion>
	</ul>
	<Motion as="span" class="text-sm text-muted" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
		Inline as a span.
	</Motion>
</div>
