<!-- @example Shapes :: The shared corner shapes. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<Input {shape} placeholder={`Shape ${shape}`} aria-label={`Shape ${shape}`} />
	{/each}
</div>
