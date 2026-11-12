<!-- @example Usage :: A workspace address with a scheme prefix and a Copy button. -->
<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@fractaldesign/fractalsvelte-ui';

	let host = $state('acme.fractal.app');
</script>

<div class="measure-sm">
	<InputGroup>
		<InputGroupAddon side="start">
			<InputGroupText>https://</InputGroupText>
		</InputGroupAddon>
		<InputGroupInput bind:value={host} aria-label="Workspace address" />
		<InputGroupAddon side="end">
			<InputGroupButton onclick={() => navigator.clipboard.writeText(`https://${host}`)}>Copy</InputGroupButton>
		</InputGroupAddon>
	</InputGroup>
</div>
