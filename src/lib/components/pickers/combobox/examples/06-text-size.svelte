<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	const people = [
		{ value: 'maya', label: 'Maya Chen' },
		{ value: 'jonah', label: 'Jonah Adeyemi' },
		{ value: 'priya', label: 'Priya Natarajan' }
	];
</script>

<div class="box gap-sm measure-xs">
	<Combobox size="lg" textSize="xs" options={people} value="maya" inputValue="Maya Chen" aria-label="Extra-small type" />
	<Combobox size="lg" textSize="sm" options={people} value="maya" inputValue="Maya Chen" aria-label="Small type" />
	<Combobox size="lg" textSize="md" options={people} value="maya" inputValue="Maya Chen" aria-label="Medium type" />
	<Combobox size="lg" textSize="lg" options={people} value="maya" inputValue="Maya Chen" aria-label="Large type" />
	<Combobox size="lg" textSize="xl" options={people} value="maya" inputValue="Maya Chen" aria-label="Extra-large type" />
</div>
