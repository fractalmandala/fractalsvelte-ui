<!-- @example Sizes :: Five sizes, from xs to xl. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<RadioGroup
			orientation="horizontal"
			size={size}
			value="b"
			name={`size-${size}`}
			aria-label={`Size ${size}`}
		>
			<Radio value="a" label={`${size} option`} />
			<Radio value="b" label="Selected" />
		</RadioGroup>
	{/each}
</div>
