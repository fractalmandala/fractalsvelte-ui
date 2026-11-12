<!-- @example Types :: Every built-in view-transition type, including a function that picks slide-back. -->
<script lang="ts">
	import { Button, PageTransition } from '@fractaldesign/fractalsvelte-ui';
	import type { OnNavigateLike, ViewTransitionType } from '@fractaldesign/fractalsvelte-ui/motion';

	const types: ViewTransitionType[] = ['fade', 'slide', 'slide-back', 'scale', 'reveal', 'none'];
	let type = $state<ViewTransitionType>('fade');
	let page = $state(0);
	const onNavigate: OnNavigateLike = () => {};
	const fromNav = (nav: { delta?: number }): ViewTransitionType => ((nav.delta ?? 0) < 0 ? 'slide-back' : 'slide');
</script>

<div class="box gap-md">
	<div class="row gap-xs wrap">
		{#each types as value (value)}
			<Button variant={type === value ? 'secondary' : 'ghost'} size="sm" onclick={() => (type = value)}>{value}</Button>
		{/each}
	</div>
	<PageTransition {onNavigate} {type} key={`${type}-${page}`}>
		<div class="box gap-xs pad-lg bg-panel">
			<p class="text-lg weight-500">Panel {page + 1}</p>
			<p class="text-sm text-secondary">Type {type}. In browsers without view transitions this panel springs; otherwise route transitions would use the View Transition API.</p>
			<Button variant="outline" size="sm" onclick={() => (page = (page + 1) % 3)}>Next panel</Button>
		</div>
	</PageTransition>
	<p class="text-xs text-muted">The hook-only form below passes type as a function of the navigation (back → slide-back).</p>
	<PageTransition {onNavigate} type={fromNav} />
</div>
