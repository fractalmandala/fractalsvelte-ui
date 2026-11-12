<!-- @example Loading and shortcut :: A spinner while results load, and a / key that focuses the field. -->
<script lang="ts">
	import { SearchInput } from '@fractaldesign/fractalsvelte-ui';

	let query = $state('');
	let loading = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function onSearch(value: string): void {
		clearTimeout(timer);
		loading = value.length > 0;
		timer = setTimeout(() => (loading = false), 600);
	}
</script>

<div class="measure-sm box gap-sm">
	<SearchInput
		bind:value={query}
		{loading}
		shortcut="/"
		placeholder="Search invoices"
		aria-label="Search invoices"
		onValueChange={() => {}}
		{onSearch}
	/>
	<p class="text-sm text-muted">Press / from anywhere on the page to focus the field.</p>
</div>
