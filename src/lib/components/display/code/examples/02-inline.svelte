<!-- @example Inline :: A short snippet in running text with its own plate, inset and ink, next to a block snippet that keeps the panel. -->
<script lang="ts">
	import { Code } from '@fractaldesign/fractalsvelte-ui';
</script>

<p class="text-body">
	Call <Code form="inline" code="formatUsd(128400)" lang="ts" textSize="text-md" textColor="text-primary" /> to print the figure as currency,
	or pass <Code form="inline" code="notation: 'compact'" lang="ts" surface="outlined" pad="pad-sm" /> for a short form.
</p>
