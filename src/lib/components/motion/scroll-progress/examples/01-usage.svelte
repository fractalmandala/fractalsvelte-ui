<!-- @example Usage :: A hairline at the top of the viewport that follows the page. -->
<script lang="ts">
	import { ScrollProgress } from '@fractaldesign/fractalsvelte-ui';
</script>

<ScrollProgress variant="bar" position="top" target="page" tone="info" />
<p class="text-sm text-secondary">The bar at the top of the viewport fills as this page is scrolled.</p>
