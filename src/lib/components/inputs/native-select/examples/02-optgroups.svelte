<!-- @example Optgroups :: Options grouped by continent, including a disabled one. -->
<script lang="ts">
	import { NativeSelect } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="measure-sm">
	<NativeSelect
		value="dub"
		aria-label="Airport"
		options={[
			{
				label: 'Europe',
				options: [
					{ value: 'dub', label: 'Dublin' },
					{ value: 'ams', label: 'Amsterdam' },
					{ value: 'fra', label: 'Frankfurt', disabled: true }
				]
			},
			{
				label: 'North America',
				options: [
					{ value: 'sfo', label: 'San Francisco' },
					{ value: 'iad', label: 'Washington Dulles' }
				]
			}
		]}
	/>
</div>
