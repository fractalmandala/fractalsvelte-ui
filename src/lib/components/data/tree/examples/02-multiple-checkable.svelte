<!-- @example Multiple selection and checkboxes :: multiple selection, checkable with tri-state propagation, and change callbacks. -->
<script lang="ts">
	import { Tree, type TreeItem } from '@fractaldesign/fractalsvelte-ui';
	import { luBuilding2, luUser } from '@fractaldesign/icons/lucide';

	const items: TreeItem[] = [
		{
			id: 'platform',
			label: 'Platform',
			icon: luBuilding2,
			children: [
				{ id: 'ines', label: 'Ines Duarte', icon: luUser },
				{ id: 'lukas', label: 'Lukas Berg', icon: luUser },
				{ id: 'retired', label: 'Former contractor', icon: luUser, disabled: true }
			]
		},
		{
			id: 'growth',
			label: 'Growth',
			icon: luBuilding2,
			children: [
				{ id: 'kenji', label: 'Kenji Mori', icon: luUser },
				{ id: 'owen', label: 'Owen Blake', icon: luUser }
			]
		},
		{
			id: 'billing',
			label: 'Billing',
			icon: luBuilding2,
			children: [
				{ id: 'amara', label: 'Amara Okafor', icon: luUser },
				{ id: 'nina', label: 'Nina Varela', icon: luUser }
			]
		}
	];

	let expanded = $state(new Set<string>(['platform', 'growth', 'billing']));
	let selected = $state(new Set<string>(['ines']));
	let checked = $state(new Set<string>(['growth', 'kenji', 'owen']));

	function onExpandedChange(next: Set<string>) {
		expanded = next;
	}

	function onSelectedChange(next: string | Set<string> | null) {
		if (next instanceof Set) selected = next;
	}

	function onCheckedChange(next: Set<string>) {
		checked = next;
	}
</script>

<div class="box gap-sm">
	<Tree
		{items}
		bind:expanded
		{onExpandedChange}
		bind:selected
		{onSelectedChange}
		multiple
		checkable
		bind:checked
		{onCheckedChange}
		label="Teams"
	/>
	<p class="text-sm text-muted">
		Selected {selected.size}. Checked {checked.size}.
	</p>
</div>
