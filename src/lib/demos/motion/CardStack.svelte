<script lang="ts">
	import { CardStack } from '$lib/styler';

	const items = [
		{ id: '1', title: 'First', description: 'The first card.' },
		{ id: '2', title: 'Second', description: 'The second card.' },
		{ id: '3', title: 'Third', description: 'The third card.' }
	];
</script>

<CardStack {items} />
