<!-- @example Link, block and still :: href renders an anchor; a disabled link stays an <a> with aria-disabled. Target opens a new tab, block fills the row, and pressable={false} turns the spring off. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	import { luExternalLink } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-sm measure-sm">
	<Button block href="https://svelte.dev" target="_blank" variant="outline" iconEnd={luExternalLink}>
		Read the Svelte docs
	</Button>
	<Button block href="https://svelte.dev/tutorial" disabled variant="outline">Tutorial (coming soon)</Button>
	<Button block variant="secondary" pressable={false}>No spring on this one</Button>
</div>
