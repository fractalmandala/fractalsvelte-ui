<script>
	import { DropdownMenu } from 'fractalsvelte/components';

	let lastAction = $state('—');

	const items = [
		{ label: 'Duplicate', shortcut: '⌘D', onSelect: () => (lastAction = 'Duplicate') },
		{ label: 'Rename', onSelect: () => (lastAction = 'Rename') },
		{ label: 'Move to…', onSelect: () => (lastAction = 'Move to…') }
	];
</script>

<div class="row gap-s ycenter">
	<DropdownMenu {items} label="Actions" />
	<span class="text-muted text-sm">Last action: {lastAction}</span>
</div>
