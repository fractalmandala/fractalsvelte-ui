<!-- @example Sizes and shapes :: Three sizes on the control height ladder, and the five corner shapes from square to pill. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		<Tag size="sm" variant="outline">Small</Tag>
		<Tag size="md" variant="outline">Medium</Tag>
		<Tag size="lg" variant="outline">Large</Tag>
	</div>
	<div class="row wrap gap-sm ycenter">
		<Tag shape="rect" variant="themed">Rect</Tag>
		<Tag shape="mincurved" variant="themed">Min curved</Tag>
		<Tag shape="modern" variant="themed">Modern</Tag>
		<Tag shape="curved" variant="themed">Curved</Tag>
		<Tag shape="round" variant="themed">Round</Tag>
	</div>
</div>
