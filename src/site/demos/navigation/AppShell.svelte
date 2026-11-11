<script lang="ts">
	import { AppShell } from '@fractaldesign/fractalsvelte-ui';
</script>

<AppShell>
	{#snippet header()}<span>App</span>{/snippet}
	{#snippet sidebar()}<nav>Menu</nav>{/snippet}
	<p>Main content</p>
</AppShell>
