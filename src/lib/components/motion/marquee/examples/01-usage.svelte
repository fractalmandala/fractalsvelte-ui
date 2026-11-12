<!-- @example Usage :: A row of partner names, travelling left at a steady pace. -->
<script lang="ts">
	import { Marquee } from '@fractaldesign/fractalsvelte-ui';

	const partners = ['Northwind', 'Fjord Line', 'Harbor & Co.', 'Lumen Press', 'Oak & Iron', 'Fieldnote', 'Palais Studio', 'Kite & Reed'];
</script>

<Marquee aria-label="Partner studios">
	{#each partners as name (name)}
		<span class="tag">{name}</span>
	{/each}
</Marquee>
