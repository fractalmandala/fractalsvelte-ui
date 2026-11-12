<!-- @example Sizes and shapes :: Five sizes, five corner shapes; the button stays square throughout. -->
<script lang="ts">
	import { IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luPlus } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, extra small" variant="secondary" size="xs" />
		<IconButton icon={luPlus} label="Add, small" variant="secondary" size="sm" />
		<IconButton icon={luPlus} label="Add, medium" variant="secondary" size="md" />
		<IconButton icon={luPlus} label="Add, large" variant="secondary" size="lg" />
		<IconButton icon={luPlus} label="Add, extra large" variant="secondary" size="xl" />
	</div>
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, rect" variant="outline" shape="rect" />
		<IconButton icon={luPlus} label="Add, mincurved" variant="outline" shape="mincurved" />
		<IconButton icon={luPlus} label="Add, modern" variant="outline" shape="modern" />
		<IconButton icon={luPlus} label="Add, curved" variant="outline" shape="curved" />
		<IconButton icon={luPlus} label="Add, round" variant="outline" shape="round" />
	</div>
</div>
