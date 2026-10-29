<script lang="ts">
	import { SplitPane } from '$lib/styler';
</script>

<SplitPane>
	{#snippet paneA()}<p>Left pane</p>{/snippet}
	{#snippet paneB()}<p>Right pane</p>{/snippet}
</SplitPane>
