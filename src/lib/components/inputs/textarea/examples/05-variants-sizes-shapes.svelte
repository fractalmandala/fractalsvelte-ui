<!-- @example Variants, sizes and shapes :: The shared axes, plus an invalid state and ref. -->
<script lang="ts">
	import { Button, Textarea } from '@fractaldesign/fractalsvelte-ui';

	let area = $state<HTMLTextAreaElement | null>(null);
</script>

<div class="box gap-sm measure-md">
	{#each ['outline', 'filled', 'ghost'] as const as look (look)}
		<Textarea value="Read-only note" disabled />
<Textarea {look} rows={1} value={look} aria-label={look} />
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Textarea {size} rows={1} value={`Size ${size}`} aria-label={`Size ${size}`} />
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<Textarea {shape} rows={1} value={`Shape ${shape}`} aria-label={`Shape ${shape}`} />
	{/each}
	<Textarea invalid bind:ref={area} rows={2} value="Too short." aria-label="Feedback" />
	<div><Button size="h-sm" variant="secondary" onclick={() => area?.focus()}>Focus feedback</Button></div>
</div>
