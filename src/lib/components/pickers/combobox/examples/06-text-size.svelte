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
	<Combobox size="h-lg" textSize="text-xs" options={people} value="maya" inputValue="Maya Chen" aria-label="Extra-small type" />
	<Combobox size="h-lg" textSize="text-sm" options={people} value="maya" inputValue="Maya Chen" aria-label="Small type" />
	<Combobox size="h-lg" textSize="text-md" options={people} value="maya" inputValue="Maya Chen" aria-label="Medium type" />
	<Combobox size="h-lg" textSize="text-lg" options={people} value="maya" inputValue="Maya Chen" aria-label="Large type" />
	<Combobox size="h-lg" textSize="text-xl" options={people} value="maya" inputValue="Maya Chen" aria-label="Extra-large type" />
</div>
