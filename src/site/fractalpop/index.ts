/**
 * Vendored from fractalpop-main (modules/fractalpop-main/packages/core/src + svelte/src/Code.svelte).
 * Do not install @fractalpop/* — the published package is broken (workspace:^ dep).
 * Languages included: javascript, typescript, css, scss, sass, html, svelte, json, shell (bash), plaintext.
 * Theme: sveltekit light/dark from theme.ts.
 */
import { registerLanguage, allLanguages } from './lang-registry.js';
import type { ParseOptions } from './core.js';
import { config as javascript } from './lang/javascript.js';
import { config as typescript } from './lang/typescript.js';
import { config as css } from './lang/css.js';
import { config as scss } from './lang/scss.js';
import { config as sass } from './lang/sass.js';
import { config as html } from './lang/html.js';
import { config as svelte } from './lang/svelte.js';
import { config as json } from './lang/json.js';
import { config as shell } from './lang/shell.js';
import { config as plaintext } from './lang/plaintext.js';

const configs: Record<string, ParseOptions> = { javascript, typescript, css, scss, sass, html, svelte, json, shell, plaintext };
for (const language of allLanguages) registerLanguage(language, configs[language.id]);

export { parse, generate } from './core.js';
export { lang, getLanguageConfig } from './lang-registry.js';
export { themeStyle, sveltekit, sveltekitLight, sveltekitDark, type Theme } from './theme.js';
export type { DisplayOptions } from './shared.js';
