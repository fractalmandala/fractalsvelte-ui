<!-- @example Orientation :: The label above the control, or in a column beside it. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-xl measure-lg">
	<Field orientation="vertical" label="Display name" hint="Shown on comments and mentions.">
		<Input value="Ada Lovelace" />
	</Field>
	<Field orientation="horizontal" label="Company" hint="Appears on invoices.">
		<Input value="Analytical Engines Ltd." />
	</Field>
</div>
