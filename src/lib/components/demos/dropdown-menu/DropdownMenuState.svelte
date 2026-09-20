<script>
	import { DropdownMenu } from 'fractalsvelte/components';

	const items = [
		{ label: 'Publish', onSelect: () => console.log('Publish') },
		{ label: 'Unpublish', disabled: true },
		{ label: 'Delete draft', danger: true, onSelect: () => console.log('Delete') }
	];
</script>

<DropdownMenu {items} label="Draft" />
