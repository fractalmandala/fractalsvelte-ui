<script lang="ts">
	import { Breadcrumb } from '$lib/styler';

	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Website' }
	];
</script>

<Breadcrumb {items} />
