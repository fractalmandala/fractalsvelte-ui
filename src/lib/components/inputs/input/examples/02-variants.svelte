<!-- @example Variants :: Outline, secondary and ghost fields. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'secondary', 'ghost'] as const as variant (variant)}
		<Input {variant} value="Quarterly planning" aria-label={`${variant} input`} />
	{/each}
</div>
