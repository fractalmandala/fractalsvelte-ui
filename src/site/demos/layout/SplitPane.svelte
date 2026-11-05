<script lang="ts">
	import SplitPane from '$lib/components/layout/SplitPane.svelte';
</script>

<SplitPane>
	{#snippet paneA()}<p>Left pane</p>{/snippet}
	{#snippet paneB()}<p>Right pane</p>{/snippet}
</SplitPane>
