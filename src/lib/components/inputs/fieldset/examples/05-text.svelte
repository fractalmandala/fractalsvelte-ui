<!-- @example Text :: The legend takes `textSize` and `textColor`; the description and error take the child pair. -->
<script lang="ts">
	import { Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Fieldset
		legend="Larger legend"
		description="The legend is text-lg; the description follows it."
		textSize="text-lg"
		textColor="text-primary"
	>
		<Switch label="Weekly digest" />
	</Fieldset>
	<Fieldset
		legend="Quieter legend"
		description="Secondary ink, with the child pair set explicitly."
		textSize="text-md"
		textColor="text-secondary"
		childTextSize="text-sm"
		childTextColor="text-muted"
	>
		<Switch label="Weekly digest" />
	</Fieldset>
</div>
