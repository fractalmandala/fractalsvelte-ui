<script lang="ts">
	import { Skeleton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row ycenter gap-md wfull">
	<Skeleton circle width="48px" />
	<div class="grow">
		<Skeleton lines={2} height="12px" />
	</div>
</div>
