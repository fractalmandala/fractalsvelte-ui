<script lang="ts">
	import Header from '$lib/components/navigation/Header.svelte';
</script>

<Header>
	{#snippet brand()}<strong>Acme</strong>{/snippet}
</Header>
