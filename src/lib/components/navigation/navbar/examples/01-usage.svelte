<!-- @example Usage :: A sticky bar with a brand, three links and a trailing action. -->
<script lang="ts">
	import { Navbar, NavbarLink, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Navbar label="Site" menuLabel="Open menu" sticky glassOnScroll>
	{#snippet brand()}
		<span class="weight-600 text-primary">Northwind Atlas</span>
	{/snippet}
	<NavbarLink href="/charts" current>Charts</NavbarLink>
	<NavbarLink href="/log">Ship's log</NavbarLink>
	<NavbarLink href="/about">About</NavbarLink>
	{#snippet actions()}
		<Button variant="ghost" size="sm" href="/subscribe">Subscribe</Button>
	{/snippet}
</Navbar>
