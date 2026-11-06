<script lang="ts">
	import Ribbon from '$lib/components/display/Ribbon.svelte';
	import Card from '$lib/components/layout/Card.svelte';
</script>

<div class="relative w-64">
	<Card title="Pro Subscription" description="Unlimited team access and custom domains.">
		<Ribbon variant="primary" position="top-right">PRO</Ribbon>
		<p class="text-sm text-secondary">Card content featuring a corner ribbon banner.</p>
	</Card>
</div>
