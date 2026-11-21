<!-- @example Text :: The label takes `textSize` and `textColor`; the hint and the error take the child pair. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Field
		label="Workspace name"
		hint="The label is text-lg in the body ink; the hint is text-md."
		textSize="text-lg"
		textColor="text-primary"
		childTextSize="text-md"
	>
		<Input placeholder="acme" />
	</Field>

	<Field
		label="Support inbox"
		hint="A quieter label, with the child pair set to the same scale."
		textSize="text-md"
		textColor="text-secondary"
		childTextSize="text-md"
		childTextColor="text-secondary"
	>
		<Input placeholder="hello@acme.com" />
	</Field>

	<Field
		label="Company"
		error="Enter the registered company name."
		textSize="text-md"
		childTextSize="text-md"
	>
		<Input placeholder="Analytical Engines Ltd." invalid />
	</Field>
</div>
