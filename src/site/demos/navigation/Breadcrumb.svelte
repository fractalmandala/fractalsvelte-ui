<script lang="ts">
	import Breadcrumb from '$lib/components/navigation/Breadcrumb.svelte';

	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Website' }
	];
</script>

<Breadcrumb {items} />
