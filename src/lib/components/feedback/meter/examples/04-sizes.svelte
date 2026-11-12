<!-- @example Sizes :: Track thickness follows the text scale, from xs to xl. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Meter size="xs" value={56} label="xs" showValue />
	<Meter size="sm" value={56} label="sm" showValue />
	<Meter size="md" value={56} label="md" showValue />
	<Meter size="lg" value={56} label="lg" showValue />
	<Meter size="xl" value={56} label="xl" showValue />
</div>
