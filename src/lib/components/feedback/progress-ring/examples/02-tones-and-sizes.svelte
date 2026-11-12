<!-- @example Tones and sizes :: Every tone and every diameter, from xs to xl. -->
<script lang="ts">
	import { ProgressRing } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<ProgressRing tone="neutral" size="xs" value={40} />
	<ProgressRing tone="info" size="sm" value={68} />
	<ProgressRing tone="success" size="md" value={100} />
	<ProgressRing tone="warning" size="lg" value={91} />
	<ProgressRing tone="danger" size="xl" value={12} />
</div>
