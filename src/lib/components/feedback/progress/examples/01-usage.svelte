<!-- @example Usage :: A labelled bar at two thirds, with the percentage shown. -->
<script lang="ts">
	import { Progress } from '@fractaldesign/fractalsvelte-ui';
</script>

<Progress value={68} max={100} label="Uploading archive.tar.gz" showValue />
