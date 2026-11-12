<!-- @example Sizes :: Track thickness follows the text scale, from xs to xl. -->
<script lang="ts">
	import { Progress } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Progress size="xs" value={56} label="xs" showValue />
	<Progress size="sm" value={56} label="sm" showValue />
	<Progress size="md" value={56} label="md" showValue />
	<Progress size="lg" value={56} label="lg" showValue />
	<Progress size="xl" value={56} label="xl" showValue />
</div>
