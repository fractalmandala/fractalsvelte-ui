<!-- @example Usage :: Responsive auto-fit grid of equal cards without manual breakpoints. -->
<script lang="ts">
	import { SimpleGrid } from '@fractaldesign/fractalsvelte-ui';
</script>

<SimpleGrid minChildWidth="10rem" gap="gap-md">
	{#each ['Analytics', 'Billing', 'Members', 'Webhooks'] as item (item)}
		<div class="outlined modern pad-md text-sm weight-500">{item}</div>
	{/each}
</SimpleGrid>
