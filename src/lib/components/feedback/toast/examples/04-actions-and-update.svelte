<!-- @example Actions, update and promise :: Action and cancel buttons, an in-place update, and a promise that settles. -->
<script lang="ts">
	import { Button, toast } from '@fractaldesign/fractalsvelte-ui';

	function publish() {
		void toast.promise(
			new Promise<{ id: string }>((resolve) => {
				setTimeout(() => resolve({ id: 'dep_1842' }), 1600);
			}),
			{
				loading: 'Publishing v2.8.1 to all regions…',
				success: (result) => `v2.8.1 is live (${result.id})`,
				error: 'The publish was rejected by the registry'
			}
		);
	}

	function save() {
		const id = toast.loading('Saving draft…');
		setTimeout(() => {
			toast.success('Draft saved to atlas.studio', {
				id,
				description: 'Only you can see it until you publish.',
				action: { label: 'Open draft', href: '#draft' },
				cancel: { label: 'Dismiss' }
			});
		}, 1200);
	}
</script>

<div class="row wrap gap-sm">
	<Button size="sm" onclick={publish}>Publish (promise)</Button>
	<Button size="sm" variant="secondary" onclick={save}>Save (update in place)</Button>
	<Button
		size="sm"
		variant="secondary"
		onclick={() =>
			toast('Your trial ends in 3 days', {
				type: 'warning',
				description: 'Add a payment method to keep this workspace.',
				action: { label: 'Choose a plan', href: '#billing' },
				cancel: { label: 'Not now' },
				duration: 0
			})}
	>
		Trial (action)
	</Button>
	<Button size="sm" variant="ghost" onclick={() => toast.dismiss()}>Dismiss all</Button>
</div>
