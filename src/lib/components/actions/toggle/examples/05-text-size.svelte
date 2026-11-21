<!-- @example Text scale and ink :: The type scale and the ink are set independently of the control height. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
	import { luBell } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		<Toggle size="h-lg" textSize="text-sm">Small type</Toggle>
		<Toggle size="h-lg" textSize="text-md" gap="gap-md">Medium type, wider gap</Toggle>
		<Toggle size="h-lg" textSize="text-lg">Large type</Toggle>
		<Toggle size="h-lg" textSize="text-xl">Extra-large type</Toggle>
	</div>
	<div class="row wrap gap-sm ycenter">
		<Toggle variant="outline" textColor="text-primary" pressed>Body ink</Toggle>
		<Toggle variant="outline" textColor="text-secondary">Secondary ink</Toggle>
		<Toggle variant="outline" textColor="text-warning" icon={luBell} pressed>Alert ink</Toggle>
		<Toggle variant="outline" textColor="text-danger">Danger ink</Toggle>
	</div>
</div>
