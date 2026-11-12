<!-- @example Range, size and links :: Wider siblings and boundaries, every size, and an href builder for real links. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	let page = $state(8);
	let sized = $state(3);
</script>

<div class="box gap-xl">
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Siblings and boundaries</p>
		<Pagination bind:page total={240} pageSize={10} siblings={2} boundaries={2} />
	</div>
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">As links</p>
		<Pagination page={5} count={12} href={(n) => `/catalogue?page=${n}`} />
	</div>
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Sizes</p>
		<div class="box gap-md">
			{#each sizes as size (size)}
				<Pagination bind:page={sized} count={8} {size} />
			{/each}
		</div>
	</div>
</div>
