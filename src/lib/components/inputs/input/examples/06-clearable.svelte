<!-- @example Clearable :: A clear button appears with text; textColor sets the ink of the icon and the clear affordance. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';

	let value = $state('Invoice #2041');
	let changes = $state(0);
</script>

<div class="box gap-sm measure-sm">
	<Input
		bind:value
		clearable
		textColor="text-secondary"
		placeholder="Reference"
		aria-label="Reference"
		onValueChange={() => changes++}
	/>
	<p class="text-sm text-muted tabular-nums">{changes} changes. Press Escape to clear.</p>
</div>
