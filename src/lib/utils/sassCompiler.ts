import { browser } from '$app/env';

export interface CompileResult {
	success: boolean;
	css: string;
	error?: string;
	line?: number;
	column?: number;
	durationMs?: number;
	syntaxUsed: 'indented' | 'scss' | 'css';
}

let sassModule: typeof import('sass') | null = null;
let sassLoadingPromise: Promise<typeof import('sass') | null> | null = null;

export async function loadSass(): Promise<typeof import('sass') | null> {
	if (sassModule) return sassModule;
	if (!browser) return null;
	if (!sassLoadingPromise) {
		sassLoadingPromise = import('sass')
			.then((m) => {
				sassModule = m;
				return m;
			})
			.catch((err) => {
				console.error('[Designbench] Failed to dynamically load Dart Sass:', err);
				return null;
			});
	}
	return sassLoadingPromise;
}

export function detectSyntax(code: string): 'indented' | 'scss' | 'css' {
	const trimmed = code.trim();
	if (!trimmed) return 'css';

	const hasOpenBrace = trimmed.includes('{');
	const hasCloseBrace = trimmed.includes('}');

	// If there are no braces at all, it's indented Sass
	if (!hasOpenBrace && !hasCloseBrace) {
		return 'indented';
	}

	// If it has braces and Sass-specific markers, treat as SCSS
	if (trimmed.includes('$') || trimmed.includes('@include') || trimmed.includes('@mixin') || trimmed.includes('&')) {
		return 'scss';
	}

	return 'css';
}

export async function compileStyles(
	source: string,
	mode: 'auto' | 'indented' | 'scss' | 'css' = 'auto'
): Promise<CompileResult> {
	const trimmed = source.trim();
	if (!trimmed) {
		return { success: true, css: '', durationMs: 0, syntaxUsed: 'css' };
	}

	const syntax = mode === 'auto' ? detectSyntax(source) : mode;
	const startTime = performance.now();

	// If plain CSS without Sass features and Sass isn't loaded yet, fast-path plain CSS
	if (syntax === 'css' && !sassModule) {
		return {
			success: true,
			css: source,
			durationMs: Math.round(performance.now() - startTime),
			syntaxUsed: 'css'
		};
	}

	try {
		const sass = await loadSass();
		if (!sass) {
			// Fallback if sass is not available: return raw css if css mode, or inform user
			if (syntax === 'css') {
				return {
					success: true,
					css: source,
					durationMs: Math.round(performance.now() - startTime),
					syntaxUsed: 'css'
				};
			}
			return {
				success: false,
				css: '',
				error: 'Dart Sass compiler is initializing...',
				syntaxUsed: syntax
			};
		}

		const dartSyntax = syntax === 'indented' ? 'indented' : 'scss';
		const res = sass.compileString(source, {
			syntax: dartSyntax
		});

		return {
			success: true,
			css: res.css,
			durationMs: Math.round(performance.now() - startTime),
			syntaxUsed: syntax
		};
	} catch (err: any) {
		const line = err.span?.start?.line != null ? err.span.start.line + 1 : undefined;
		const column = err.span?.start?.column != null ? err.span.start.column + 1 : undefined;
		return {
			success: false,
			css: '',
			error: err.message || String(err),
			line,
			column,
			syntaxUsed: syntax
		};
	}
}
