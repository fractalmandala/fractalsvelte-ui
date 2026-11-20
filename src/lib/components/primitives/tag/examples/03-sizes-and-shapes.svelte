<!-- @example Sizes and shapes :: Every step of the control height ladder, and the five corner shapes from square to pill. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
			<Tag {size} variant="outline">{size}</Tag>
		{/each}
	</div>
	<div class="row wrap gap-sm ycenter">
		<Tag shape="rect" variant="themed">Rect</Tag>
		<Tag shape="mincurved" variant="themed">Min curved</Tag>
		<Tag shape="modern" variant="themed">Modern</Tag>
		<Tag shape="curved" variant="themed">Curved</Tag>
		<Tag shape="round" variant="themed">Round</Tag>
	</div>
</div>
