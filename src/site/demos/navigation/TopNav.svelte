<script lang="ts">
	import { TopNav } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Blog', href: '/blog' }
	];
</script>

<TopNav {items} />
