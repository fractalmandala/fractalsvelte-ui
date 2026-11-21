<!-- @example Variants, sizes and shapes :: Every look of the shared field frame. -->
<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'secondary', 'ghost'] as const as variant (variant)}
		<InputGroup {variant}>
			<InputGroupAddon>
				<InputGroupText>@</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput value="ada" aria-label={`${variant} username`} />
		</InputGroup>
	{/each}
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<InputGroup {size}>
			<InputGroupAddon>
				<InputGroupText>kg</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput value="12.4" aria-label={`Size ${size}`} />
		</InputGroup>
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<InputGroup {shape}>
			<InputGroupInput value="Invoice #2041" aria-label={`Shape ${shape}`} />
		</InputGroup>
	{/each}
</div>
