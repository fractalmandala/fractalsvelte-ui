<!-- @example Sizes, shapes and glyph :: Height climbs the ladder, the glyph scale is its own axis, and the button stays square throughout. -->
<script lang="ts">
	import { IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luPlus } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, medium" variant="secondary" size="h-md" />
		<IconButton icon={luPlus} label="Add, large" variant="secondary" size="h-lg" />
		<IconButton icon={luPlus} label="Add, extra large" variant="secondary" size="h-xl" />
	</div>
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, small glyph" variant="outline" textSize="text-sm" />
		<IconButton icon={luPlus} label="Add, base glyph" variant="outline" textSize="text-md" />
		<IconButton icon={luPlus} label="Add, large glyph" variant="outline" textSize="text-lg" />
		<IconButton icon={luPlus} label="Add, extra-large glyph" variant="outline" textSize="text-xl" />
	</div>
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, body ink" variant="outline" textColor="text-primary" />
		<IconButton icon={luPlus} label="Add, warning ink" variant="outline" textColor="text-warning" />
		<IconButton icon={luPlus} label="Add, danger ink" variant="outline" textColor="text-danger" />
	</div>
	<div class="row wrap gap-sm ycenter">
		<IconButton icon={luPlus} label="Add, rect" variant="outline" shape="rect" />
		<IconButton icon={luPlus} label="Add, mincurved" variant="outline" shape="mincurved" />
		<IconButton icon={luPlus} label="Add, modern" variant="outline" shape="modern" />
		<IconButton icon={luPlus} label="Add, curved" variant="outline" shape="curved" />
		<IconButton icon={luPlus} label="Add, round" variant="outline" shape="round" />
	</div>
</div>
