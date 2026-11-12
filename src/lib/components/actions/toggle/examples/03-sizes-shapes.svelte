<!-- @example Sizes and shapes :: Five sizes and five corner shapes. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		<Toggle variant="outline" size="xs">Extra small</Toggle>
		<Toggle variant="outline" size="sm">Small</Toggle>
		<Toggle variant="outline" size="md">Medium</Toggle>
		<Toggle variant="outline" size="lg">Large</Toggle>
		<Toggle variant="outline" size="xl">Extra large</Toggle>
	</div>
	<div class="row wrap gap-sm ycenter">
		<Toggle variant="outline" shape="rect">Rect</Toggle>
		<Toggle variant="outline" shape="mincurved">Mincurved</Toggle>
		<Toggle variant="outline" shape="modern">Modern</Toggle>
		<Toggle variant="outline" shape="curved">Curved</Toggle>
		<Toggle variant="outline" shape="round">Round</Toggle>
	</div>
</div>
