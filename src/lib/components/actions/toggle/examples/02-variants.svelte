<!-- @example Variants :: Subtle variants fill when pressed; solid ones gain an inset ring. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Toggle variant="primary" pressed>Primary</Toggle>
	<Toggle variant="secondary" pressed>Secondary</Toggle>
	<Toggle variant="themed" pressed>Themed</Toggle>
	<Toggle variant="soft" pressed>Soft</Toggle>
	<Toggle variant="outline" pressed>Outline</Toggle>
	<Toggle variant="ghost" pressed>Ghost</Toggle>
	<Toggle variant="link" pressed>Link</Toggle>
	<Toggle variant="info" pressed>Info</Toggle>
	<Toggle variant="success" pressed>Success</Toggle>
	<Toggle variant="warning" pressed>Warning</Toggle>
	<Toggle variant="danger" pressed>Danger</Toggle>
</div>
