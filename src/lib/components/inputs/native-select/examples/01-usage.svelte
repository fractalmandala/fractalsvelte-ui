<!-- @example Usage :: A bound region picker inside a Field. -->
<script lang="ts">
	import { Field, NativeSelect } from '@fractaldesign/fractalsvelte-ui';

	let region = $state('eu-west-1');
</script>

<div class="measure-sm box gap-sm">
	<Field label="Region" hint="Where the workspace will run.">
		<NativeSelect
			bind:value={region}
			placeholder="Choose a region"
			options={[
				{ value: 'us-east-1', label: 'N. Virginia' },
				{ value: 'eu-west-1', label: 'Ireland' },
				{ value: 'ap-south-1', label: 'Mumbai' }
			]}
		/>
	</Field>
	<p class="text-sm text-muted">Selected: {region}</p>
</div>
