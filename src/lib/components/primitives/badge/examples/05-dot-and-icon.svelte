<!-- @example Dot and icon :: A leading dot marks live state; an icon sits before the label when it adds meaning. -->
<script lang="ts">
	import { Badge } from '@fractaldesign/fractalsvelte-ui';
	import { luCheck, luCircleAlert } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<Badge variant="success" dot>Online</Badge>
	<Badge variant="warning" dot>Degraded</Badge>
	<Badge variant="danger" icon={luCircleAlert}>2 failed checks</Badge>
	<Badge variant="success" icon={luCheck}>Verified</Badge>
</div>
