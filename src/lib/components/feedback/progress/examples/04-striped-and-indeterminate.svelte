<!-- @example Striped and indeterminate :: Diagonal stripes on a known value, and a sliding bar for work of unknown length. -->
<script lang="ts">
	import { Progress } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Progress value={44} label="Indexing repository" showValue striped />
	<Progress indeterminate label="Waiting for the build runner" tone="info" />
</div>
