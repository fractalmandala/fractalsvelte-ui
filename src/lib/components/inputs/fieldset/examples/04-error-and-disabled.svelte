<!-- @example Error and disabled :: An error takes over the description slot; disabled dims the whole group. -->
<script lang="ts">
	import { Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Fieldset
		legend="Invoice details"
		description="Who the invoice is addressed to."
		error="Choose at least one billing contact."
		invalid
	>
		<Switch label="Send to finance" />
	</Fieldset>
	<Fieldset legend="Archived preferences" description="Kept for reference." disabled>
		<Switch label="Email digest" disabled />
	</Fieldset>
</div>
