<!-- @example Usage :: Storage used on a 500 GB volume, with the value shown. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<Meter variant="linear" value={327} min={0} max={500} label="Storage used" showValue valueText="327 GB of 500 GB" />
