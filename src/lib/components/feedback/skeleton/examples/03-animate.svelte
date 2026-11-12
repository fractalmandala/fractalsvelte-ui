<!-- @example Animation :: A shimmer, a pulse, and a still placeholder. -->
<script lang="ts">
	import { Skeleton } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg measure-sm">
	<div class="box gap-xs">
		<p class="text-sm text-muted">shimmer</p>
		<Skeleton animate="shimmer" lines={2} />
	</div>
	<div class="box gap-xs">
		<p class="text-sm text-muted">pulse</p>
		<Skeleton animate="pulse" lines={2} />
	</div>
	<div class="box gap-xs">
		<p class="text-sm text-muted">none</p>
		<Skeleton animate="none" lines={2} />
	</div>
</div>
