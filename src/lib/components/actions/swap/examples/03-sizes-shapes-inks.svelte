<!-- @example Sizes, shapes and inks :: The button follows the same height ladder, corner shapes and text axis as Button. -->
<script lang="ts">
	import { Swap } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<div class="row wrap ycenter gap-sm">
		<Swap label="Lock, medium" size="h-md" variant="outline" />
		<Swap label="Lock, large" size="h-lg" variant="outline" />
		<Swap label="Lock, extra large" size="h-xl" variant="outline" />
	</div>
	<div class="row wrap ycenter gap-sm">
		<Swap label="Lock, rect" shape="rect" variant="secondary" />
		<Swap label="Lock, mincurved" shape="mincurved" variant="secondary" />
		<Swap label="Lock, modern" shape="modern" variant="secondary" />
		<Swap label="Lock, curved" shape="curved" variant="secondary" />
		<Swap label="Lock, round" shape="round" variant="secondary" />
	</div>
	<div class="row wrap ycenter gap-sm">
		<Swap label="Lock, small glyph" textSize="text-sm" variant="ghost" />
		<Swap label="Lock, large glyph" textSize="text-lg" variant="ghost" />
		<Swap label="Lock, warning ink" textColor="text-warning" variant="outline" />
		<Swap label="Lock, danger ink" textColor="text-danger" variant="outline" />
		<Swap label="Lock, off-centre glyph" alignContent="xleft" size="h-xl" variant="outline" />
	</div>
</div>
