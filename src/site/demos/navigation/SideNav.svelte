<script lang="ts">
	import SideNav from '$lib/components/navigation/SideNav.svelte';

	const items = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<SideNav {items} />
