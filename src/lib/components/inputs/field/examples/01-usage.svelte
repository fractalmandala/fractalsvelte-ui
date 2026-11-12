<!-- @example Usage :: A labelled input with helper text; the label, hint and input are wired together automatically. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';

	let email = $state('');
</script>

<div class="measure-sm">
	<Field label="Work email" hint="We send receipts and security alerts here.">
		<Input type="email" bind:value={email} placeholder="you@company.com" autocomplete="email" />
	</Field>
</div>
