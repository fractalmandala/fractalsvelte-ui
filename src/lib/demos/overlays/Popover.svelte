<script lang="ts">
	import { Popover, Button } from '$lib/styler';
</script>

<Popover>
	{#snippet trigger({ toggle })}<Button onclick={toggle}>Info</Button>{/snippet}
	<p>Popover content</p>
</Popover>
