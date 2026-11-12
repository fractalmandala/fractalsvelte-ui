<!-- @example Sticky :: The banner pins to the top of the scrollport as the page moves. -->
<script lang="ts">
	import { Banner } from '@fractaldesign/fractalsvelte-ui';
</script>

<Banner tone="warning" title="Incident in eu-west-3" sticky>
	API latency is elevated. We are failing over read traffic to eu-west-1.
</Banner>
