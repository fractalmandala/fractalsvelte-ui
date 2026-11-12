<!-- @example Strength :: A meter that scores length and character variety as you type. -->
<script lang="ts">
	import { Field, PasswordInput } from '@fractaldesign/fractalsvelte-ui';

	let password = $state('');
</script>

<div class="measure-sm">
	<Field label="New password" hint="Use at least 12 characters, with mixed case, a number and a symbol.">
		<PasswordInput bind:value={password} strength placeholder="Create a password" autocomplete="new-password" onValueChange={() => {}} />
	</Field>
</div>
