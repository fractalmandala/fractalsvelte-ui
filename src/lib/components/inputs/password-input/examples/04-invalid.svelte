<!-- @example Invalid :: A confirmation that does not match, marked invalid. -->
<script lang="ts">
	import { Field, PasswordInput } from '@fractaldesign/fractalsvelte-ui';

	const original = 'harbor-1847';
	let confirm = $state('harbor-184');
	const invalid = $derived(confirm !== original);
</script>

<div class="measure-sm">
	<Field label="Confirm password" error={invalid ? 'The passwords do not match.' : undefined}>
		<PasswordInput bind:value={confirm} {invalid} autocomplete="new-password" />
	</Field>
</div>
