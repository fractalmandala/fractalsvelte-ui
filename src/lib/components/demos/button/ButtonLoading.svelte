<script>
	import { Button } from 'fractalsvelte/components';

	let saving = $state(false);

	$effect(() => {
		if (!saving) return;
		const timer = setTimeout(() => (saving = false), 1600);
		return () => clearTimeout(timer);
	});
</script>

<div class="row wrap gap-sm ycenter">
	<Button loading={saving} onclick={() => (saving = true)}>Save changes</Button>
	<Button variant="outline" loading>Uploading…</Button>
</div>
