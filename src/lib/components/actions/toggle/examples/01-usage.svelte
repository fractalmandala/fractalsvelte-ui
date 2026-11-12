<!-- @example Usage :: Bind pressed to read and write the state. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
	import { luBold } from '@fractaldesign/icons/lucide';

	let bold = $state(false);
</script>

<div class="row ycenter gap-md">
	<Toggle bind:pressed={bold} icon={luBold}>Bold</Toggle>
	<span class="text-sm text-secondary">{bold ? 'Selected text will be bold' : 'Formatting is off'}</span>
</div>
