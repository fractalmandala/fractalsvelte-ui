<!-- @example Elements :: as chooses the element. Use span inside a sentence and div around a block of text the reader should hear. -->
<script lang="ts">
	import { VisuallyHidden } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<p class="text-secondary">
		Total <VisuallyHidden as="span">for this order,</VisuallyHidden> $248.00
	</p>
	<VisuallyHidden as="div">
		<p>The totals below are in US dollars and include tax.</p>
	</VisuallyHidden>
</div>
