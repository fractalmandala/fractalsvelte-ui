<!-- @example Size, shape and scroll cap :: Row height climbs the ladder, the frame changes corner, the panel takes its own surface, padding and row gap with quieter secondary text, and maxHeight caps the list. -->
<script lang="ts">
	import { Listbox, type ListboxOption } from '@fractaldesign/fractalsvelte-ui';

	const regions: ListboxOption[] = [
		{ value: 'iad', label: 'Virginia', description: 'us-east-1' },
		{ value: 'fra', label: 'Frankfurt', description: 'eu-central-1' },
		{ value: 'sin', label: 'Singapore', description: 'ap-southeast-1' },
		{ value: 'syd', label: 'Sydney', description: 'ap-southeast-2' },
		{ value: 'gru', label: 'São Paulo', description: 'sa-east-1' }
	];
</script>

<div class="row wrap gap-lg">
	<div class="measure-xs">
		<Listbox options={regions} size="h-md" shape="modern" value="fra" label="Region, medium" />
	</div>
	<div class="measure-xs">
		<Listbox options={regions} size="h-lg" shape="curved" value="fra" label="Region, large" />
	</div>
	<div class="measure-xs">
		<Listbox options={regions} size="h-xl" shape="round" maxHeight="h-xl" value="fra" label="Region, capped at extra large" />
	</div>
	<div class="measure-xs">
		<Listbox
			options={regions}
			size="h-lg"
			shape="curved"
			surface="paneled"
			pad="pad-md"
			gap="gap-sm"
			childTextSize="text-sm"
			childTextColor="text-secondary"
			value="fra"
			label="Region, paneled"
		/>
	</div>
</div>
