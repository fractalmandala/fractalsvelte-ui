<script lang="ts">
	import { Anchor, Button } from '$lib/styler';
</script>

<Anchor open>
	{#snippet trigger()}<Button>Anchor</Button>{/snippet}
	{#snippet panel()}<div class="card bg-panel border radius-md shadow-sm pad-sm text-body-sm nowrap">Panel content</div>{/snippet}
</Anchor>
