<!-- @example Attached or spaced :: attached={false} keeps each button whole and separates them with a gap. -->
<script lang="ts">
	import { Button, ButtonGroup, IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luArrowUpRight, luShare2 } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-md">
	<ButtonGroup label="Publish, attached" attached>
		<Button variant="primary">Publish</Button>
		<Button variant="outline" icon={luShare2}>Share</Button>
		<IconButton icon={luArrowUpRight} label="Open preview" variant="outline" />
	</ButtonGroup>
	<ButtonGroup label="Publish, spaced" attached={false}>
		<Button variant="primary">Publish</Button>
		<Button variant="outline" icon={luShare2}>Share</Button>
		<IconButton icon={luArrowUpRight} label="Open preview" variant="outline" />
	</ButtonGroup>
</div>
