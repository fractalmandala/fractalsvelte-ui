<!-- @example Custom values and filter :: allowCustom commits the typed text; a custom filter matches the start of a label, and grouped options stay together. -->
<script lang="ts">
	import { Combobox, type SelectOption } from '@fractaldesign/fractalsvelte-ui';

	let tag = $state<string | null>(null);
	const options: SelectOption[] = [
		{ value: 'bug', label: 'Bug', group: 'Kind' },
		{ value: 'feature', label: 'Feature', group: 'Kind' },
		{ value: 'docs', label: 'Documentation', group: 'Kind' },
		{ value: 'perf', label: 'Performance', group: 'Priority' },
		{ value: 'security', label: 'Security', group: 'Priority' }
	];

	function filter(option: SelectOption, query: string) {
		return option.label.toLowerCase().startsWith(query.trim().toLowerCase()) || !query.trim();
	}
</script>

<div class="box gap-sm measure-xs">
	<Combobox
		{options}
		{filter}
		allowCustom
		bind:value={tag}
		placeholder="Label or type a new one"
		aria-label="Issue label"
	/>
	<p class="text-sm text-muted">{tag ? `Label: ${tag}` : 'Pick a label, or type a new one and press Enter'}</p>
</div>
