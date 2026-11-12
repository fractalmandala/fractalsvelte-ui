<!-- @example Enter and exit presets :: Every preset, each with a matching enter and exit. -->
<script lang="ts">
	import { Button, Presence } from '@fractaldesign/fractalsvelte-ui';

	const presets = ['fade', 'scale', 'fly-up', 'fly-down', 'fly-left', 'fly-right', 'blur', 'slide'] as const;
	let show = $state(true);
	let preset = $state<(typeof presets)[number]>('fade');
</script>

<div class="box gap-md measure-sm">
	<div class="row wrap gap-sm">
		{#each presets as name}
			<Button variant={preset === name ? 'primary' : 'ghost'} size="sm" onclick={() => (preset = name)}>{name}</Button>
		{/each}
	</div>
	<Button variant="secondary" onclick={() => (show = !show)}>{show ? 'Hide' : 'Show'}</Button>
	<Presence {show} enter={preset} exit={preset} spring="snappy">
		<div class="card rim shad-md pad-lg">
			<p class="text-sm text-muted">{preset}</p>
			<p class="weight-500">The Saturday magazine cover</p>
		</div>
	</Presence>
</div>
