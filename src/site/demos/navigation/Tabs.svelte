<script lang="ts">
	import Tabs from '$lib/components/navigation/Tabs.svelte';

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'activity', label: 'Activity' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<Tabs {tabs}>
	<p>Tab content</p>
</Tabs>
