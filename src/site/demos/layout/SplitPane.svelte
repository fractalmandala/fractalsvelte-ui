<script lang="ts">
	import { SplitPane } from '@fractaldesign/fractalsvelte-ui';
</script>

<SplitPane>
	{#snippet paneA()}<p>Left pane</p>{/snippet}
	{#snippet paneB()}<p>Right pane</p>{/snippet}
</SplitPane>
