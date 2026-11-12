<!-- @example A static bar :: sticky and glassOnScroll turned off, for a bar that stays in the document flow. -->
<script lang="ts">
	import { Navbar, NavbarLink, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Navbar sticky={false} glassOnScroll={false} label="Publisher">
	{#snippet brand()}
		<span class="weight-600 text-primary">Harbour Press</span>
	{/snippet}
	<NavbarLink href="/titles">Titles</NavbarLink>
	<NavbarLink href="/authors">Authors</NavbarLink>
	{#snippet actions()}
		<Button variant="secondary" size="sm">Sign in</Button>
	{/snippet}
</Navbar>
