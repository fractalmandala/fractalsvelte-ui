<!-- @example Usage :: A catalogue search that reports the query after typing settles. -->
<script lang="ts">
	import { Field, SearchInput } from '@fractaldesign/fractalsvelte-ui';

	let query = $state('');
	let last = $state('');
</script>

<div class="measure-sm box gap-sm">
	<Field label="Search the catalogue">
		<SearchInput bind:value={query} placeholder="Titles, authors, ISBNs" onSearch={(value) => (last = value)} />
	</Field>
	<p class="text-sm text-muted">{last ? `Showing results for “${last}”.` : 'Start typing, or press Enter.'}</p>
</div>
