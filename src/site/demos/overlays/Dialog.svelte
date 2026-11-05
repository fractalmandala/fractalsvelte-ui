<script lang="ts">
	import Dialog from '$lib/components/overlays/Dialog.svelte';
	import Button from '$lib/components/actions/Button.svelte';
	import FormField from '$lib/components/forms/FormField.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import TextArea from '$lib/components/forms/TextArea.svelte';

	let open = $state(false);
</script>

<Dialog bind:open title="Edit profile" description="Update how others see you across the workspace.">
	{#snippet trigger({ open: show })}<Button onclick={show}>Edit profile</Button>{/snippet}
	<div class="box gap-md">
		<FormField label="Display name">
			<Input value="Asha Rao" />
		</FormField>
		<FormField label="Email" helperText="Used for sign-in and notifications.">
			<Input type="email" value="asha@fractal.design" />
		</FormField>
		<TextArea label="Bio" value="Product designer working on the design system." rows={3} />
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
		<Button onclick={() => (open = false)}>Save changes</Button>
	{/snippet}
</Dialog>
