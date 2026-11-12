<!-- @example Invalid :: A query that is too short to search. -->
<script lang="ts">
	import { Field, SearchInput } from '@fractaldesign/fractalsvelte-ui';

	let query = $state('a');
	const invalid = $derived(query.length > 0 && query.length < 2);
</script>

<div class="measure-sm">
	<Field label="Find a customer" error={invalid ? 'Type at least two characters.' : undefined}>
		<SearchInput bind:value={query} {invalid} placeholder="Name or account number" />
	</Field>
</div>
