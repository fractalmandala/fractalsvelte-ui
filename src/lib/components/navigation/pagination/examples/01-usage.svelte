<!-- @example Usage :: A numbered control bound to the current page of a catalogue. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';

	let page = $state(4);
</script>

<div class="box gap-sm">
	<p class="text-sm text-muted">Showing page {page} of the spring catalogue.</p>
	<Pagination bind:page onPageChange={() => {}} count={24} label="Pagination" />
</div>
