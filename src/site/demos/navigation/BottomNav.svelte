<script lang="ts">
	import { BottomNav } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ id: 'home', label: 'Home' },
		{ id: 'search', label: 'Search' },
		{ id: 'profile', label: 'Profile' }
	];
</script>

<BottomNav {items} />
