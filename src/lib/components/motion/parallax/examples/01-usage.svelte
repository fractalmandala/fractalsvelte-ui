<!-- @example Usage :: A caption that lags slightly behind the scroll. -->
<script lang="ts">
	import { Parallax } from '@fractaldesign/fractalsvelte-ui';
</script>

<Parallax speed={0.25} class="pad-xl">
	<p class="text-2xl weight-500">The Greenwich workshop looks out over the river.</p>
	<p class="text-sm text-secondary">A slower layer, so the line trails the scroll by a fraction.</p>
</Parallax>
