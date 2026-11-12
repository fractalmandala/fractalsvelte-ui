<!-- @example Usage :: A TypeScript module in a highlighted block, with a copy button. -->
<script lang="ts">
	import { Code } from '@fractaldesign/fractalsvelte-ui';

	const source = `export function formatUsd(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(value);
}
`;
</script>

<Code variant="block" code={source} lang="ts" filename="formatUsd.ts" />
