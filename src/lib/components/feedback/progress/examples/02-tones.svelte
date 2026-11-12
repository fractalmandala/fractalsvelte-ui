<!-- @example Tones :: Neutral, info, success, warning and danger fills. -->
<script lang="ts">
	import { Progress } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Progress tone="neutral" value={40} label="Queued" showValue />
	<Progress tone="info" value={68} label="Uploading" showValue />
	<Progress tone="success" value={100} label="Synced" showValue />
	<Progress tone="warning" value={91} label="Build minutes used" showValue />
	<Progress tone="danger" value={12} label="Failed shards retried" showValue />
</div>
