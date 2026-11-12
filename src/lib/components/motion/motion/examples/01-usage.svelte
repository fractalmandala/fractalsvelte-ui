<!-- @example Usage :: A heading springs from a slight offset and fade into place. -->
<script lang="ts">
	import { Motion } from '@fractaldesign/fractalsvelte-ui';
</script>

<Motion as="section" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} spring="gentle">
	<p class="text-sm text-muted">This week in typography</p>
	<p class="weight-500">The Caslon revival on Bond Street</p>
</Motion>
