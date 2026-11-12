<!-- @example Languages :: The six languages the highlighter understands. -->
<script lang="ts">
	import { Button, Code } from '@fractaldesign/fractalsvelte-ui';

	type Lang = 'svelte' | 'ts' | 'css' | 'bash' | 'json' | 'html';

	const close = '<' + '/script>';
	const samples: Record<Lang, { filename: string; code: string }> = {
		svelte: {
			filename: 'Widget.svelte',
			code: `<script lang="ts">
	let open = $state(false);
${close}

<button class="button primary" onclick={() => (open = !open)}>
	{open ? 'Hide' : 'Show'} details
</button>
`
		},
		ts: {
			filename: 'hooks.ts',
			code: `export async function loadSession(id: string): Promise<Session> {
	const res = await fetch(\`/api/sessions/\${id}\`);
	if (!res.ok) throw new Error('Session not found');
	return res.json();
}
`
		},
		css: {
			filename: 'theme.css',
			code: `.hero {
	background-color: color-mix(in oklab, var(--theme-color) 16%, transparent);
	border-radius: var(--radius-lg);
}
`
		},
		bash: {
			filename: 'deploy.sh',
			code: `#!/usr/bin/env bash
set -euo pipefail
pnpm verify "$1"
pnpm --filter @fractaldesign/fractalsvelte-ui build
`
		},
		json: {
			filename: 'package.json',
			code: `{
  "name": "@fractaldesign/fractalsvelte-ui",
  "version": "0.1.0",
  "type": "module"
}
`
		},
		html: {
			filename: 'index.html',
			code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>fractalsvelte-ui</title>
  </head>
</html>
`
		}
	};

	let lang = $state<Lang>('svelte');
</script>

<div class="box gap-bs">
	<div class="row wrap gap-sm">
		{#each ['svelte', 'ts', 'css', 'bash', 'json', 'html'] as const as next}
			<Button variant={lang === next ? 'secondary' : 'ghost'} size="sm" onclick={() => (lang = next)}>
				{next}
			</Button>
		{/each}
	</div>
	<Code code={samples[lang].code} {lang} filename={samples[lang].filename} showLineNumbers />
</div>
