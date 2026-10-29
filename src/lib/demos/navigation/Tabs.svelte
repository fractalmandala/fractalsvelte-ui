<script lang="ts">
	import { Tabs } from '$lib/styler';

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'activity', label: 'Activity' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<Tabs {tabs}>
	<p>Tab content</p>
</Tabs>
