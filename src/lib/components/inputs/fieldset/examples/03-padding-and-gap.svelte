<!-- @example Padding and gap :: Both ride the shared ladders, so a group composes with the rest of the kit. -->
<script lang="ts">
	import { Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Fieldset legend="Roomy" gap="gap-lg" pad="pad-lg">
		<Switch label="Beta features" />
		<Switch label="Release notes" />
	</Fieldset>
	<Fieldset legend="Tight" gap="gap-xs" pad="pad-xs">
		<Switch label="Beta features" />
		<Switch label="Release notes" />
	</Fieldset>
</div>
