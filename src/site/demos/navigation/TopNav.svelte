<script lang="ts">
	import TopNav from '$lib/components/navigation/TopNav.svelte';

	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Blog', href: '/blog' }
	];
</script>

<TopNav {items} />
