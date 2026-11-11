<script lang="ts">
	import { Popover, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Popover>
	{#snippet trigger({ toggle })}<Button onclick={toggle}>Info</Button>{/snippet}
	<p>Popover content</p>
</Popover>
