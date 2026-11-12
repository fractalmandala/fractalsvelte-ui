<!-- @example Checkboxes and radios :: Checkbox items stay open after they toggle; a radio group closes on a choice. -->
<script lang="ts">
	import {
		Menubar,
		MenubarMenu,
		MenuCheckboxItem,
		MenuLabel,
		MenuRadioGroup,
		MenuRadioItem,
		MenuSeparator
	} from '@fractaldesign/fractalsvelte-ui';

	let comments = $state(true);
	let activity = $state(false);
	let density = $state('comfortable');
</script>

<Menubar label="Harbour view options">
	<MenubarMenu value="view" label="View">
		<MenuLabel>Shown in the list</MenuLabel>
		<MenuCheckboxItem bind:checked={comments} onCheckedChange={(next) => (comments = next)} shortcut="⌘⇧C">
			Comments
		</MenuCheckboxItem>
		<MenuCheckboxItem bind:checked={activity} onCheckedChange={(next) => (activity = next)} disabled>
			Activity (coming soon)
		</MenuCheckboxItem>
		<MenuSeparator />
		<MenuLabel>Density</MenuLabel>
		<MenuRadioGroup bind:value={density} onValueChange={(next) => (density = next)}>
			<MenuRadioItem value="compact" shortcut="⌘1">Compact</MenuRadioItem>
			<MenuRadioItem value="comfortable" shortcut="⌘2">Comfortable</MenuRadioItem>
			<MenuRadioItem value="spacious" disabled>Spacious (beta)</MenuRadioItem>
		</MenuRadioGroup>
	</MenubarMenu>
	<MenubarMenu value="window" label="Window">
		<MenuCheckboxItem checked={false}>Show sidebar</MenuCheckboxItem>
		<MenuCheckboxItem checked={true}>Show inspector</MenuCheckboxItem>
	</MenubarMenu>
</Menubar>
