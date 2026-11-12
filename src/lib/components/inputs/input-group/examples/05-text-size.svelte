<!-- @example Text size :: The text scale can be set independently of the frame height. -->
<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<InputGroup size="lg" textSize="xs">
		<InputGroupAddon side="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Extra-small type" />
	</InputGroup>
	<InputGroup size="lg" textSize="sm">
		<InputGroupAddon side="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Small type" />
	</InputGroup>
	<InputGroup size="lg" textSize="md">
		<InputGroupAddon side="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Medium type" />
	</InputGroup>
	<InputGroup size="lg" textSize="lg">
		<InputGroupAddon side="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Large type" />
	</InputGroup>
	<InputGroup size="lg" textSize="xl">
		<InputGroupAddon side="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
		<InputGroupInput value="acme.fractal.app" aria-label="Extra-large type" />
	</InputGroup>
</div>
