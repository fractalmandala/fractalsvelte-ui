<script lang="ts">
	import MobileNav from '$lib/components/navigation/MobileNav.svelte';
	import Button from '$lib/components/actions/Button.svelte';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Menu</Button>
<MobileNav bind:open title="Menu">
	<a href="/">Home</a>
</MobileNav>
