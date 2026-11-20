<!-- @example Usage :: Inline editable headings and double-click confirmation controls. -->
<script lang="ts">
	import { Editable } from '@fractaldesign/fractalsvelte-ui';

	let title = $state('Fractal Release Notes');
	let subtitle = $state('Double-click to edit with buttons');
</script>

<div class="column gap-md measure-sm">
	<Editable bind:value={title} aria-label="Document title" />
	<Editable
		bind:value={subtitle}
		activationMode="dblclick"
		withControls
		aria-label="Subtitle"
	/>
</div>
