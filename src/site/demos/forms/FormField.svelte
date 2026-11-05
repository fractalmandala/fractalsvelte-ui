<script lang="ts">
	import FormField from '$lib/components/forms/FormField.svelte';
	import Input from '$lib/components/forms/Input.svelte';
</script>

<FormField label="Email" id="email" helperText="We never share it.">
	<Input id="email" type="email" />
</FormField>
