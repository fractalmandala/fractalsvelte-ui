<!-- @example Resize :: Which directions the drag handle allows. -->
<script lang="ts">
	import { Textarea } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs measure-xl">
	{#each ['none', 'vertical', 'horizontal', 'both'] as const as resize (resize)}
		<Textarea {resize} rows={2} value={`resize: ${resize}`} aria-label={`Resize ${resize}`} />
	{/each}
</div>
