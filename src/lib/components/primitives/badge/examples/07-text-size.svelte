<!-- @example Text size :: The text scale can be set independently of the badge height. -->
<script lang="ts">
	import { Badge } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Badge size="lg" textSize="sm" variant="themed">Small type</Badge>
	<Badge size="lg" textSize="md" variant="themed">Medium type</Badge>
	<Badge size="lg" textSize="lg" variant="themed">Large type</Badge>
</div>
