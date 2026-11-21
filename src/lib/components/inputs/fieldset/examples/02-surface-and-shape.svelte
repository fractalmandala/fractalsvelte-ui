<!-- @example Surface and shape :: The group can sit on any surface of the ladder, in any corner shape. -->
<script lang="ts">
	import { Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Fieldset legend="Outlined" surface="outlined" shape="modern">
		<Switch label="Weekly digest" />
	</Fieldset>
	<Fieldset legend="Elevated" surface="elevated" shape="curved">
		<Switch label="Failure alerts" />
	</Fieldset>
	<Fieldset legend="Vacant" surface="vacant" shape="rect">
		<Switch label="Product news" />
	</Fieldset>
</div>
