<!-- @example Text size :: The text scale can be set independently of the badge height. -->
<script lang="ts">
	import { Badge } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Badge size="h-lg" textSize="text-sm" variant="themed">Small type</Badge>
	<Badge size="h-lg" textSize="text-md" variant="themed">Medium type</Badge>
	<Badge size="h-lg" textSize="text-lg" variant="themed">Large type</Badge>
</div>
