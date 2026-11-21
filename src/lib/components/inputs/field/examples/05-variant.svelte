<!-- @example Variant, size and shape :: The Field passes them down to the control inside; the control's own props win. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Field label="Workspace name" size="h-md" shape="modern" variant="outline" hint="Medium, modern, outlined.">
		<Input placeholder="acme" />
	</Field>
	<Field label="Support inbox" size="h-lg" shape="curved" variant="secondary" hint="Large, curved, tinted.">
		<Input placeholder="hello@acme.com" />
	</Field>
	<Field label="Display name" size="h-xl" shape="round" variant="ghost" hint="Extra-large, pill, bare until hovered.">
		<Input placeholder="Ada Lovelace" />
	</Field>
	<Field label="Company" size="h-md" variant="outline" hint="The field says medium and outlined; the control inside sets its own.">
		<Input size="h-xl" variant="secondary" shape="curved" placeholder="Analytical Engines Ltd." />
	</Field>
</div>
