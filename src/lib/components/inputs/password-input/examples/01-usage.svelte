<!-- @example Usage :: A sign-in password inside a Field, with a reveal toggle. -->
<script lang="ts">
	import { Field, PasswordInput } from '@fractaldesign/fractalsvelte-ui';

	let password = $state('');
</script>

<div class="measure-sm">
	<Field label="Password" hint="Your password is never stored in the example.">
		<PasswordInput bind:value={password} placeholder="Enter your password" autocomplete="current-password" />
	</Field>
</div>
