// Self-test for src/lib/internal/highlight.ts: every lexer must reproduce its
// input exactly (no dropped or reordered characters) and classify the basics.
// Run directly (`node scripts/lib/highlight.selftest.ts`) or via `pnpm gate`.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, listDir, readText, walkFiles } from './util.ts';

type Lang = 'svelte' | 'ts' | 'css' | 'bash' | 'json' | 'html';
interface Tok {
	text: string;
	cls: string | null;
}
interface HighlightModule {
	tokenize: (code: string, lang: Lang) => Tok[];
	highlight: (code: string, lang: Lang) => Tok[][];
}

const SAMPLES: { lang: Lang; code: string; expect: [string, string][] }[] = [
	{
		lang: 'svelte',
		code: `<!-- @example Usage :: A button. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	let count = $state(0); // a comment
	const label = \`Clicked \${count} times\`;
</script>

{#if count > 1}
	<Button variant="primary" onclick={() => count++} {...rest}>Go {label}</Button>
{:else}
	{@render children?.()}
{/if}
<p class="text-sm {active ? 'a' : 'b'}">x < y && { "unterminated</p>`,
		expect: [
			['<!-- @example Usage :: A button. -->', 'tok-com'],
			['import', 'tok-kw'],
			["'@fractaldesign/fractalsvelte-ui'", 'tok-str'],
			['$state', 'tok-fn'],
			['// a comment', 'tok-com'],
			['#if', 'tok-kw'],
			['Button', 'tok-type'],
			['variant', 'tok-attr'],
			['@render', 'tok-kw'],
			['/if', 'tok-kw']
		]
	},
	{
		lang: 'ts',
		code: "export function f<T>(x: number = 0x1F, y = 1.5e3): Promise<T> { return /* c */ `a${x + `b${y}`}` as unknown as Promise<T>; }\nconst s = 'unterminated\nlet r = a / b // tail",
		expect: [
			['export', 'tok-kw'],
			['f', 'tok-fn'],
			['0x1F', 'tok-num'],
			['/* c */', 'tok-com'],
			['Promise', 'tok-type']
		]
	},
	{
		lang: 'css',
		code: `/* layer */\n@media (min-width: 40rem) {\n\t.track.vertical > .thumb:hover { translate: calc(var(--x, 0) * 1%) 0; color: #fff !important; }\n}\n.a{b:c}`,
		expect: [
			['/* layer */', 'tok-com'],
			['@media', 'tok-kw'],
			['translate', 'tok-attr'],
			['var', 'tok-fn'],
			['--x', 'tok-type'],
			['!important', 'tok-kw']
		]
	},
	{
		lang: 'bash',
		code: 'pnpm add @fractaldesign/fractalsvelte-ui --save-dev # install\nexport FOO="bar" && echo $FOO | wc -l',
		expect: [
			['pnpm', 'tok-fn'],
			['--save-dev', 'tok-attr'],
			['# install', 'tok-com'],
			['"bar"', 'tok-str']
		]
	},
	{
		lang: 'json',
		code: '{ "name": "fractalsvelte", "n": -1.5e2, "ok": true, "list": [null, 2] }',
		expect: [
			['"name"', 'tok-attr'],
			['"fractalsvelte"', 'tok-str'],
			['-1.5e2', 'tok-num'],
			['true', 'tok-kw']
		]
	},
	{
		lang: 'html',
		code: '<!doctype html><html lang="en"><body data-x=1><style>.a { color: red; }</style><script>let a = 1 < 2;</script></body></html>',
		expect: [
			['html', 'tok-tag'],
			['lang', 'tok-attr'],
			['color', 'tok-attr']
		]
	}
];

function hasToken(tokens: Tok[], text: string, cls: string): boolean {
	return tokens.some((t) => t.cls === cls && t.text.includes(text));
}

export async function selftest(): Promise<string[]> {
	const mod = (await import(pathToFileURL(path.join(ROOT, 'src/lib/internal/highlight.ts')).href)) as HighlightModule;
	const failures: string[] = [];
	const roundTrip = (code: string, lang: Lang, label: string) => {
		const flat = mod.tokenize(code, lang);
		if (flat.map((t) => t.text).join('') !== code) failures.push(`${lang}: tokens do not reproduce ${label}`);
		const lines = mod.highlight(code, lang);
		if (lines.map((l) => l.map((t) => t.text).join('')).join('\n') !== code) failures.push(`${lang}: lines do not reproduce ${label}`);
		return flat;
	};
	for (const s of SAMPLES) {
		const flat = roundTrip(s.code, s.lang, 'the sample');
		for (const [text, cls] of s.expect) {
			if (!hasToken(flat, text, cls)) failures.push(`${s.lang}: expected "${text}" as ${cls}`);
		}
		// every prefix must round-trip too (unterminated strings, half tags)
		for (let n = 0; n < s.code.length; n += 7) roundTrip(s.code.slice(0, n), s.lang, `a ${n}-char prefix`);
	}
	// every real source in the repo round-trips
	const files = [
		...walkFiles(path.join(ROOT, 'src'), (n) => n.endsWith('.svelte') || n.endsWith('.ts') || n.endsWith('.css')),
		...listDir(path.join(ROOT, 'scripts'), 'file').map((n) => path.join(ROOT, 'scripts', n))
	];
	for (const f of files) {
		const code = readText(f);
		if (code === null) continue;
		const lang: Lang = f.endsWith('.svelte') ? 'svelte' : f.endsWith('.css') ? 'css' : 'ts';
		roundTrip(code, lang, path.relative(ROOT, f));
	}
	return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	const failures = await selftest();
	for (const f of failures) console.log(`✘ ${f}`);
	console.log(failures.length ? `${failures.length} highlight failures` : '✔ highlight self-test passed');
	process.exitCode = failures.length ? 1 : 0;
}
