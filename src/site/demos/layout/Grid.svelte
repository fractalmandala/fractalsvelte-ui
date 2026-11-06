<script lang="ts">
	import Grid from '$lib/components/layout/Grid.svelte';
	import Card from '$lib/components/layout/Card.svelte';
</script>

<Grid cols={3} gap={4}>
	<Card title="Card 1" description="Grid item one" />
	<Card title="Card 2" description="Grid item two" />
	<Card title="Card 3" description="Grid item three" />
</Grid>
