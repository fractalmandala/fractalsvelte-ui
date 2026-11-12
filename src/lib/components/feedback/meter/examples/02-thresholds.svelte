<!-- @example Thresholds :: Low, high and optimum pick a tone the way a native meter does. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs">
	<Meter value={18} max={100} low={20} high={80} optimum={10} label="Free memory" showValue valueText="18% free — below the low watermark" />
	<Meter value={64} max={100} low={20} high={80} optimum={50} label="CPU headroom" showValue valueText="64% — inside the preferred band" />
	<Meter value={93} max={100} low={20} high={80} optimum={10} label="Scratch disk" showValue valueText="93% full — past the high watermark" />
</div>
