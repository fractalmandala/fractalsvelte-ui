<!-- @example Tones :: A forced tone on each of the five status colours. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Meter tone="neutral" value={40} label="Queued jobs" showValue />
	<Meter tone="info" value={68} label="Index coverage" showValue />
	<Meter tone="success" value={96} label="Uptime this month" showValue />
	<Meter tone="warning" value={81} label="Build minutes used" showValue />
	<Meter tone="danger" value={12} label="Replica lag budget" showValue />
</div>
