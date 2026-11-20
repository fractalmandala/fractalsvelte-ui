<!-- @example Stripes and indeterminate :: A striped fill for a long job, and a sweeping track when the length is not known. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Meter value={62} min={0} max={100} label="Reindexing" showValue striped />
	<Meter form="linear" indeterminate label="Waiting for the queue" />
	<Meter form="ring" indeterminate label="Warming the cache" />
</div>
