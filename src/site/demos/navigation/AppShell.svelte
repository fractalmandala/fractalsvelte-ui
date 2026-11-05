<script lang="ts">
	import AppShell from '$lib/components/navigation/AppShell.svelte';
</script>

<AppShell>
	{#snippet header()}<span>App</span>{/snippet}
	{#snippet sidebar()}<nav>Menu</nav>{/snippet}
	<p>Main content</p>
</AppShell>
