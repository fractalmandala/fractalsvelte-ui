<!-- @example Wrap and height :: Soft-wrapped lines, and every maximum height on the measure ladder. -->
<script lang="ts">
	import { Button, Code } from '@fractaldesign/fractalsvelte-ui';

	const longLine = `const endpoint = 'https://api.mintfolio.dev/v1/billing/invoices?status=open&expand=customer,line_items&order=desc';
`;

	const longModule = `import { highlight } from './highlight.js';

export function render(code: string, lang: 'svelte' | 'ts' | 'css' | 'bash' | 'json' | 'html') {
	const lines = highlight(code, lang);
	return lines
		.map((tokens, index) => {
			const body = tokens.map((token) => token.text).join('');
			return \`\${String(index + 1).padStart(3, ' ')}  \${body}\`;
		})
		.join('\n');
}

export function countMarked(lines: number[] | string): number {
	if (Array.isArray(lines)) return new Set(lines).size;
	return lines.split(',').length;
}

export function trim(code: string): string {
	return code.replace(/^\n+/, '').replace(/\n+$/, '');
}

export const languages = ['svelte', 'ts', 'css', 'bash', 'json', 'html'] as const;
`;

	let maxHeight: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = $state('sm');
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<span class="text-sm text-muted">Soft wrap</span>
		<Code code={longLine} lang="ts" filename="endpoint.ts" wrap={true} />
	</div>
	<div class="box gap-xs">
		<span class="text-sm text-muted">Maximum height</span>
		<div class="row wrap gap-sm">
			{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as step}
				<Button
					variant={maxHeight === step ? 'secondary' : 'ghost'}
					size="sm"
					onclick={() => (maxHeight = step)}
				>
					{step}
				</Button>
			{/each}
		</div>
		<Code
			code={longModule}
			lang="ts"
			filename="render.ts"
			showLineNumbers
			highlightLines="3-5,8"
			{maxHeight}
		/>
	</div>
</div>
