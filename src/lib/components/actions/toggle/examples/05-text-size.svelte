<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Toggle size="lg" textSize="xs">Extra-small type</Toggle>
	<Toggle size="lg" textSize="sm">Small type</Toggle>
	<Toggle size="lg" textSize="md">Medium type</Toggle>
	<Toggle size="lg" textSize="lg">Large type</Toggle>
	<Toggle size="lg" textSize="xl">Extra-large type</Toggle>
</div>
