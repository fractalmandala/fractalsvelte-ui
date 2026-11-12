<!-- @example Spring presets :: The same travel, five springs side by side. Click again to interrupt one mid-flight. -->
<script lang="ts">
	import { Button, Motion } from '@fractaldesign/fractalsvelte-ui';

	const presets = ['gentle', 'snappy', 'bouncy', 'stiff', 'slow'] as const;

	let shifted = $state(false);
</script>

<div class="box gap-md">
	<Button variant="secondary" onclick={() => (shifted = !shifted)}>
		{shifted ? 'Send them home' : 'Send them across'}
	</Button>
	<div class="box gap-sm">
		{#each presets as preset}
			<div class="row ycenter gap-md">
				<span class="text-sm text-muted">{preset}</span>
				<Motion class="card rim shad-sm pad-sm" animate={{ x: shifted ? 160 : 0 }} spring={preset}>
					<span class="text-sm weight-500">{preset}</span>
				</Motion>
			</div>
		{/each}
	</div>
</div>
