<!-- @example Sizes :: Track thickness follows the text scale, from xs to xl. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Meter size="h-xs" value={56} label="xs" showValue />
	<Meter size="h-sm" value={56} label="sm" showValue />
	<Meter size="h-md" value={56} label="md" showValue />
	<Meter size="h-lg" value={56} label="lg" showValue />
	<Meter size="h-xl" value={56} label="xl" showValue />
	<Meter size="h-bs" value={56} label="bs" showValue />
	<Meter size="h-2xl" value={56} label="2xl" showValue />
	<Meter size="h-3xl" value={56} label="3xl" showValue />
</div>
