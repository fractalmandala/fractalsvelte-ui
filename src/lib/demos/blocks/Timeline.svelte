<script lang="ts">
	import { Timeline } from '$lib/styler';

	const items = [
		{ title: 'Order placed', time: '09:00' },
		{ title: 'Shipped', time: '14:30' },
		{ title: 'Delivered', time: '18:45' }
	];
</script>

<Timeline {items} />
