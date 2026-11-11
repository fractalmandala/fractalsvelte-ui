<script lang="ts">
	import { Accordion } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ id: 'one', title: 'Why Fractalsvelte?', content: 'No Tailwind deps, lean, growing.' },
		{ id: 'two', title: 'Is it customizable?', content: 'Why yes it is!' }
	];
</script>

<Accordion variant="ghost" border="bb" {items} />
