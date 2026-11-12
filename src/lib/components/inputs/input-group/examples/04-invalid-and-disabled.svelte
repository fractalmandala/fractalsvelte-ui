<!-- @example Invalid and disabled :: invalid marks the frame; disabled dims the input and the button. -->
<script lang="ts">
	import { Field, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@fractaldesign/fractalsvelte-ui';

	let port = $state('80');
	const invalid = $derived(!/^[0-9]+$/.test(port) || Number(port) > 65535);
</script>

<div class="box gap-md measure-sm">
	<Field label="Port" error={invalid ? 'Enter a port between 0 and 65535.' : undefined}>
		<InputGroup invalid={invalid}>
			<InputGroupInput bind:value={port} inputmode="numeric" aria-label="Port" />
			<InputGroupAddon side="end">
				<InputGroupText>TCP</InputGroupText>
			</InputGroupAddon>
		</InputGroup>
	</Field>
	<InputGroup disabled>
		<InputGroupAddon side="start">
			<InputGroupText>org</InputGroupText>
		</InputGroupAddon>
		<InputGroupInput value="fractal-labs" aria-label="Organisation slug" />
		<InputGroupAddon side="end">
			<InputGroupButton>Edit</InputGroupButton>
		</InputGroupAddon>
	</InputGroup>
</div>
