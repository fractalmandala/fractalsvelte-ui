<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Toggle size="h-lg" textSize="text-xs">Extra-small type</Toggle>
	<Toggle size="h-lg" textSize="text-sm">Small type</Toggle>
	<Toggle size="h-lg" textSize="text-md">Medium type</Toggle>
	<Toggle size="h-lg" textSize="text-lg">Large type</Toggle>
	<Toggle size="h-lg" textSize="text-xl">Extra-large type</Toggle>
	<Toggle size="h-lg" textSize="text-bs">Base type</Toggle>
	<Toggle size="h-lg" textSize="text-2xl">2× type</Toggle>
	<Toggle size="h-lg" textSize="text-3xl">3× type</Toggle>
</div>
