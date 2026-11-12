<!-- @example Usage :: A masthead list fades in, one title after another. -->
<script lang="ts">
	import { Stagger } from '@fractaldesign/fractalsvelte-ui';
</script>

<Stagger class="box gap-sm">
	<p class="weight-500">The morning edition</p>
	<p class="text-sm text-secondary">A letter from the chapel</p>
	<p class="text-sm text-secondary">The late racing results</p>
	<p class="text-sm text-secondary">Weather: rain over Fleet Street</p>
</Stagger>
