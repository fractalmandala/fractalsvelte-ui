<script lang="ts">
	import Stack from '$lib/components/layout/Stack.svelte';
	import Button from '$lib/components/actions/Button.svelte';
</script>

<Stack direction="row" gap={3} align="center">
	<Button variant="primary">Submit</Button>
	<Button variant="secondary">Cancel</Button>
	<Button variant="ghost">Learn More</Button>
</Stack>
