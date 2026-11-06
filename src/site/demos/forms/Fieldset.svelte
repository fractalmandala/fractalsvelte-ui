<script lang="ts">
	import Fieldset from '$lib/components/forms/Fieldset.svelte';
	import Input from '$lib/components/forms/Input.svelte';
</script>

<Fieldset legend="Account Credentials">
	<Input label="Email address" placeholder="user@example.com" />
	<Input label="Password" type="password" />
</Fieldset>
