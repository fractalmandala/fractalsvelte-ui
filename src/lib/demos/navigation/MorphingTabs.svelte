<script lang="ts">
	import { MorphingTabs } from '$lib/styler';

	const items = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'activity', label: 'Activity' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<MorphingTabs {items} />
