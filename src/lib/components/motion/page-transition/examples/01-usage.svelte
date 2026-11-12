<!-- @example Usage :: A panel that springs between two views when view transitions are unavailable. -->
<script lang="ts">
	import { Button, PageTransition } from '@fractaldesign/fractalsvelte-ui';
	import type { OnNavigateLike } from '@fractaldesign/fractalsvelte-ui/motion';

	let page = $state<'atelier' | 'press'>('atelier');
	const onNavigate: OnNavigateLike = () => {};
</script>

<div class="box gap-md">
	<div class="row gap-sm">
		<Button variant="ghost" onclick={() => (page = 'atelier')}>The atelier</Button>
		<Button variant="ghost" onclick={() => (page = 'press')}>The press</Button>
	</div>
	<PageTransition {onNavigate} type="slide" key={page}>
		{#if page === 'atelier'}
			<div class="box gap-xs pad-lg bg-panel">
				<p class="text-lg weight-500">The atelier</p>
				<p class="text-sm text-secondary">Sketches on the north wall, the river under the window, a single desk for cutting letters.</p>
			</div>
		{:else}
			<div class="box gap-xs pad-lg bg-panel">
				<p class="text-lg weight-500">The press</p>
				<p class="text-sm text-secondary">A Vandercook for proofs, laid paper in the drawer, the autumn catalogue on the bed.</p>
			</div>
		{/if}
	</PageTransition>
</div>
