<script lang="ts">
	import BottomNav from '$lib/components/navigation/BottomNav.svelte';

	const items = [
		{ id: 'home', label: 'Home' },
		{ id: 'search', label: 'Search' },
		{ id: 'profile', label: 'Profile' }
	];
</script>

<BottomNav {items} />
