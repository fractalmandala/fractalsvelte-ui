<!-- @example Usage :: An inline editable heading, a double-click field with buttons, and an empty one in a quieter ink. -->
<script lang="ts">
	import { Editable } from '@fractaldesign/fractalsvelte-ui';

	let title = $state('Fractal Release Notes');
	let subtitle = $state('Double-click to edit with buttons');
	let owner = $state('');
</script>

<div class="column gap-md measure-sm">
	<Editable bind:value={title} aria-label="Document title" />
	<Editable
		bind:value={subtitle}
		activationMode="dblclick"
		withControls
		aria-label="Subtitle"
	/>
	<Editable bind:value={owner} textColor="text-secondary" placeholder="Unassigned owner" aria-label="Owner" />
</div>
