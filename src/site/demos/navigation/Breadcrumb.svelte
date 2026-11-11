<script lang="ts">
	import { Breadcrumb } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Website' }
	];
</script>

<Breadcrumb {items} />
