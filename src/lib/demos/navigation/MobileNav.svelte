<script lang="ts">
	import { MobileNav, Button } from '$lib/styler';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Menu</Button>
<MobileNav bind:open title="Menu">
	<a href="/">Home</a>
</MobileNav>
