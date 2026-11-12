<!-- @example Sizes :: Five sizes, from xs to xl. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
		<RadioGroup
			orientation="horizontal"
			size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
			value="b"
			name={`size-${size}`}
			aria-label={`Size ${size}`}
		>
			<Radio value="a" label={`${size} option`} />
			<Radio value="b" label="Selected" />
		</RadioGroup>
	{/each}
</div>
