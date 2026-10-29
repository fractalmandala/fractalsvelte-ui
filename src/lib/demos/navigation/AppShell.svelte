<script lang="ts">
	import { AppShell } from '$lib/styler';
</script>

<AppShell>
	{#snippet header()}<span>App</span>{/snippet}
	{#snippet sidebar()}<nav>Menu</nav>{/snippet}
	<p>Main content</p>
</AppShell>
