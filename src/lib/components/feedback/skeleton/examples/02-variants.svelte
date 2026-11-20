<!-- @example Variants :: Text, a circle and a rectangle, with a custom number of lines. -->
<script lang="ts">
	import { Skeleton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<Skeleton form="text" lines={4} />
	<div class="row gap-md ycenter">
		<Skeleton form="circle" />
		<div class="grow"><Skeleton form="text" lines={2} /></div>
	</div>
	<Skeleton form="rect" />
</div>
