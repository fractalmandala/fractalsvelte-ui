<!-- @example States :: A lookup still loading, a field locked by the rate desk, and one that failed validation with its clear button removed. -->
<script lang="ts">
	import { Autocomplete } from '@fractaldesign/fractalsvelte-ui';

	const carriers = ['Maersk', 'MSC', 'CMA CGM'];
</script>

<div class="box gap-sm measure-sm">
	<Autocomplete options={[]} loading placeholder="Looking up carriers…" aria-label="Carrier lookup in progress" />
	<Autocomplete options={carriers} value="Maersk" disabled aria-label="Carrier, fixed by the rate desk" />
	<Autocomplete
		options={carriers}
		value="Hapag Lloyd"
		invalid
		clearable={false}
		placeholder="Carrier name"
		aria-label="Carrier name, awaiting correction"
	/>
</div>
