<!-- @example Sizes and shapes :: Five sizes and five corner shapes. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		<Toggle variant="outline" size="h-xs">Extra small</Toggle>
		<Toggle variant="outline" size="h-sm">Small</Toggle>
		<Toggle variant="outline" size="h-md">Medium</Toggle>
		<Toggle variant="outline" size="h-bs">Base</Toggle>
		<Toggle variant="outline" size="h-lg">Large</Toggle>
		<Toggle variant="outline" size="h-xl">Extra large</Toggle>
		<Toggle variant="outline" size="h-2xl">2× large</Toggle>
		<Toggle variant="outline" size="h-3xl">3× large</Toggle>
	</div>
	<div class="row wrap gap-sm ycenter">
		<Toggle variant="outline" shape="rect">Rect</Toggle>
		<Toggle variant="outline" shape="mincurved">Mincurved</Toggle>
		<Toggle variant="outline" shape="modern">Modern</Toggle>
		<Toggle variant="outline" shape="curved">Curved</Toggle>
		<Toggle variant="outline" shape="round">Round</Toggle>
	</div>
</div>
