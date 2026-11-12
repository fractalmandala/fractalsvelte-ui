<!-- @example Async search :: onInputChange loads options; loading and an empty snippet cover the wait and a miss. -->
<script lang="ts">
	import { Combobox, type SelectOption } from '@fractaldesign/fractalsvelte-ui';

	const catalogue: SelectOption[] = [
		{ value: 'svelte', label: '@sveltejs/kit', description: 'SvelteKit' },
		{ value: 'vite', label: 'vite', description: 'Next-generation frontend tooling' },
		{ value: 'pnpm', label: 'pnpm', description: 'Fast, disk-efficient package manager' },
		{ value: 'oxc', label: 'oxc', description: 'The JavaScript Oxidation compiler' },
		{ value: 'biome', label: 'biome', description: 'Toolchain for web projects' }
	];

	let pkg = $state<string | null>(null);
	let options = $state<SelectOption[]>(catalogue);
	let loading = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function onInputChange(query: string) {
		loading = true;
		clearTimeout(timer);
		timer = setTimeout(() => {
			const q = query.trim().toLowerCase();
			options = catalogue.filter((o) => o.label.toLowerCase().includes(q) || (o.description?.toLowerCase().includes(q) ?? false));
			loading = false;
		}, 200);
	}
</script>

<div class="box gap-sm measure-xs">
	<Combobox
		{options}
		{loading}
		bind:value={pkg}
		{onInputChange}
		filter={() => true}
		placeholder="Search packages"
		aria-label="Package"
	>
		{#snippet empty()}
			No packages match that name.
		{/snippet}
	</Combobox>
	<p class="text-sm text-muted">{pkg ? `Installing ${pkg}` : 'Pick a package to install'}</p>
</div>
