import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import svelte from 'shiki/langs/svelte.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import html from 'shiki/langs/html.mjs';
import css from 'shiki/langs/css.mjs';
import bash from 'shiki/langs/bash.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

const themes = {
	light: githubLight,
	dark: githubDark
};

const languageAliases: Record<string, string> = {
	sh: 'bash',
	shell: 'bash',
	shellscript: 'bash',
	ts: 'typescript',
	js: 'javascript',
	jsx: 'javascript',
	scss: 'css'
};

const cache = new Map<string, string>();
let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null;
let highlighterInstance: Awaited<ReturnType<typeof createHighlighterCore>> | null = null;

function normalizeLang(lang: string): string {
	const clean = lang.trim().toLowerCase().split(/\s+/)[0] ?? 'svelte';
	return languageAliases[clean] ?? clean;
}

function escapeHtml(str: string): string {
	return str
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function fallback(code: string, lang: string): string {
	return `<pre class="shiki" data-language="${escapeHtml(lang)}"><code>${escapeHtml(code)}</code></pre>`;
}

export function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [githubLight, githubDark],
			langs: [svelte, typescript, javascript, html, css, bash],
			engine: createJavaScriptRegexEngine()
		}).then((hl) => {
			highlighterInstance = hl;
			return hl;
		});
	}
	return highlighterPromise;
}

export async function highlight(code: string, lang = 'svelte'): Promise<string> {
	if (!code) return '';
	const normalized = normalizeLang(lang);
	const key = `${normalized}\0${code}`;
	const cached = cache.get(key);
	if (cached) return cached;

	try {
		const hl = await getHighlighter();
		const htmlOutput = hl.codeToHtml(code, {
			lang: normalized,
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
			defaultColor: false
		});
		cache.set(key, htmlOutput);
		return htmlOutput;
	} catch {
		return fallback(code, normalized);
	}
}

export function highlightSync(code: string, lang = 'svelte'): string | null {
	if (!code) return '';
	const normalized = normalizeLang(lang);
	const key = `${normalized}\0${code}`;
	const cached = cache.get(key);
	if (cached) return cached;

	if (highlighterInstance) {
		try {
			const htmlOutput = highlighterInstance.codeToHtml(code, {
				lang: normalized,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				},
				defaultColor: false
			});
			cache.set(key, htmlOutput);
			return htmlOutput;
		} catch {
			return fallback(code, normalized);
		}
	}
	return null;
}
