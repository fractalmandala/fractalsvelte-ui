<script lang="ts">
	import Label from '$lib/components/forms/Label.svelte';
	import Input from '$lib/components/forms/Input.svelte';
</script>

<div class="box gap-sm max-w-sm">
	<Label for="username" required description="Must be unique across your organization">
		Username
	</Label>
	<Input id="username" placeholder="e.g. johndoe" />
</div>
