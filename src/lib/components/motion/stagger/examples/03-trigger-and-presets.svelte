<!-- @example Trigger and presets :: Every enter preset, and an in-view group that waits until you scroll to it. -->
<script lang="ts">
	import { Button, Stagger } from '@fractaldesign/fractalsvelte-ui';

	const presets = ['fade', 'scale', 'fly-up', 'fly-down', 'fly-left', 'fly-right', 'blur', 'slide'] as const;
	let enter = $state<(typeof presets)[number]>('fly-up');
	let version = $state(0);
	const beats = ['Headline', 'Standfirst', 'Byline', 'Dateline'];
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		{#each presets as name}
			<Button variant={enter === name ? 'primary' : 'ghost'} size="sm" onclick={() => (enter = name)}>{name}</Button>
		{/each}
		<Button variant="secondary" size="sm" onclick={() => (version += 1)}>Replay</Button>
	</div>
	{#key `${enter}-${version}`}
		<Stagger {enter} trigger="mount" step={70} class="box gap-sm">
			{#each beats as beat}
				<p class="weight-500">{beat}</p>
			{/each}
		</Stagger>
	{/key}
	<div class="scroll-menu box gap-md pad-sm">
		<p class="text-sm text-muted">Scroll to stagger the credits in view.</p>
		<div class="pad-xl"></div>
		<Stagger enter="fly-up" trigger="inView" from="first" step={90} class="box gap-sm">
			<p class="weight-500">Editor: H. Marchant</p>
			<p class="text-sm text-secondary">Night editor: C. Vale</p>
			<p class="text-sm text-secondary">Picture editor: L. Osgood</p>
		</Stagger>
	</div>
</div>
