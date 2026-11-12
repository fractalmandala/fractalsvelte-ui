<!-- @example Icons and actions :: A search icon at the start and an icon-only clear button at the end. -->
<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luSearch, luX } from '@fractaldesign/icons/lucide';

	let query = $state('billing receipts');
	let changes = $state(0);
</script>

<div class="measure-sm">
	<InputGroup>
		<InputGroupAddon side="start">
			<Icon icon={luSearch} class="text-muted" />
		</InputGroupAddon>
		<InputGroupInput
			bind:value={query}
			aria-label="Search invoices"
			placeholder="Search invoices"
			onValueChange={() => changes++}
		/>
		<InputGroupAddon side="end">
			<InputGroupButton aria-label="Clear search" onclick={() => (query = '')}>
				<Icon icon={luX} />
			</InputGroupButton>
		</InputGroupAddon>
	</InputGroup>
	<p class="text-sm text-muted mt-sm tabular-nums">{changes} changes.</p>
</div>
