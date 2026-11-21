<!-- @example Orientation :: The label above the control, or in a measured column beside it. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-xl measure-xl">
	<Field orientation="vertical" label="Display name" hint="Shown on comments and mentions.">
		<Input value="Ada Lovelace" />
	</Field>
	<Field orientation="horizontal" label="Company" measure="measure-sm" gap="gap-sm" hint="Appears on invoices.">
		<Input value="Analytical Engines Ltd." />
	</Field>
</div>
