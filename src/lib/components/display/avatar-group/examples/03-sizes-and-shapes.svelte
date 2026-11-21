<!-- @example Sizes and shapes :: Every size and every shape, on a group of the same four people. -->
<script lang="ts">
	import { AvatarGroup } from '@fractaldesign/fractalsvelte-ui';

	const team = [
		{ name: 'Maya Chen' },
		{ name: 'Omar Haddad' },
		{ name: 'Priya Shah' },
		{ name: 'Jonas Berg' },
		{ name: 'Elena Rossi' }
	];
</script>

<div class="box gap-lg">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-lg', 'h-xl'] as const as size}
		<div class="row ycenter gap-bs">
			<span class="text-sm text-muted">{size}</span>
			<AvatarGroup {size} items={team} max={4} />
		</div>
	{/each}
	<div class="row wrap ycenter gap-xl">
		{#each ['round', 'curved', 'rect'] as const as shape}
			<div class="box gap-xs">
				<span class="text-sm text-muted">{shape}</span>
				<AvatarGroup {shape} items={team} max={4} />
			</div>
		{/each}
	</div>
</div>
