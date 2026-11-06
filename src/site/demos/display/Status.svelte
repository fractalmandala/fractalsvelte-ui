<script lang="ts">
	import Status from '$lib/components/display/Status.svelte';
</script>

<div class="row ycenter wrap gap-sm">
	<Status variant="success" label="Operational" animated />
	<Status variant="warning" label="Degraded" />
	<Status variant="danger" label="Offline" animated />
	<Status variant="info" label="Maintenance" lite />
</div>
