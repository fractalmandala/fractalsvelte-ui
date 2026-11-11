<script lang="ts">
	import { SideNav } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<SideNav {items} />
