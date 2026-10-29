<script lang="ts">
	import { Modal, Button } from '$lib/styler';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open</Button>
<Modal bind:open>
	<div class="box gap-sm pad-lg">
		<h3 class="page-heading-bs">Modal</h3>
		<p class="text-body-sm text-secondary">Content sits on the modal panel.</p>
		<Button variant="secondary" onclick={() => (open = false)}>Close</Button>
	</div>
</Modal>
