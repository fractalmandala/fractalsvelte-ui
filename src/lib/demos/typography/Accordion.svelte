<script lang="ts">
	import { Accordion } from '$lib/styler';

	const items = [
		{ id: 'one', title: 'What is it?', content: 'A component library.' },
		{ id: 'two', title: 'Is it free?', content: 'Yes.' }
	];
</script>

<Accordion {items} />
