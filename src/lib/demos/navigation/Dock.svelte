<script lang="ts">
	import { Dock } from '$lib/styler';

	const items = [
		{ id: 'finder', label: 'Finder' },
		{ id: 'mail', label: 'Mail' },
		{ id: 'music', label: 'Music' }
	];
</script>

<Dock {items} />
