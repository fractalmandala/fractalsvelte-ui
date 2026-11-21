<!-- @example Text size :: The text scale can be set independently of the frame height, and the prefix follows it. -->
<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<InputGroup size="h-lg" textSize="text-xs">
		<InputGroupAddon align="start"><InputGroupText textColor="text-secondary">https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Extra-small type" />
	</InputGroup>
	<InputGroup size="h-lg" textSize="text-sm">
		<InputGroupAddon align="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Small type" />
	</InputGroup>
	<InputGroup size="h-lg" textSize="text-md">
		<InputGroupAddon align="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Medium type" />
	</InputGroup>
	<InputGroup size="h-lg" textSize="text-lg">
		<InputGroupAddon align="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Large type" />
	</InputGroup>
	<InputGroup size="h-lg" textSize="text-xl">
		<InputGroupAddon align="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Extra-large type" />
	</InputGroup>
</div>
