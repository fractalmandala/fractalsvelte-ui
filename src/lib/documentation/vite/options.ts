import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePath, searchForWorkspaceRoot } from 'vite';

export type SelfOptions = {
  /** catalog file suffix: `Foo.<suffix>.svelte` / `Foo.<suffix>.md` (default 'self') */
  suffix?: string;
  /** group name -> directories to search (relative to the Vite root) */
  groups?: Record<string, string | string[]>;
  /** .svelte file wrapping every preview (relative to the Vite root) */
  wrapper?: string;
  /** logo image path (relative to the Vite root); false hides it */
  logo?: string | false;
  /** logo alt and <title> (default 'self') */
  title?: string;
  /** UI language (default 'en') */
  locale?: 'en' | 'ja';
  /** fixes the catalog and every preview to one theme and hides the switch (default: both, starting from the system's) */
  theme?: 'light' | 'dark';
  /** write the catalog as a static site on `vite build` (default false; outDir defaults to 'self-dist') */
  build?: boolean | { outDir?: string };
};

/** a file of the catalog SPA shipped with this library (`src/lib/app/` here, `dist/app/` when published) */
export const appFile = (name: string) => normalizePath(fileURLToPath(new URL(`../app/${name}`, import.meta.url)));

/** the library's own directory (`src/lib/` here, `dist/` when published); the SPA imports files from all over it */
export const libDir = normalizePath(fileURLToPath(new URL('..', import.meta.url))).replace(/\/$/, '');

const LOCALES = ['en', 'ja'];
const THEMES = ['light', 'dark'];
const quoted = (values: string[]) => values.map((v) => `"${v}"`).join(' or ');

const file = (root: string, key: string, rel: string) => {
  const abs = normalizePath(resolve(root, rel));
  if (!existsSync(abs) || !statSync(abs).isFile()) throw new Error(`svelte-self: ${key} not found: ${abs}`);
  return abs;
};

export function resolveOptions(root: string, options: SelfOptions) {
  const { suffix = 'self', locale = 'en', theme, wrapper, logo, build } = options;
  if (!LOCALES.includes(locale)) throw new Error(`svelte-self: unknown locale "${locale}" (use ${quoted(LOCALES)})`);
  if (theme !== undefined && !THEMES.includes(theme))
    throw new Error(`svelte-self: unknown theme "${theme}" (use ${quoted(THEMES)})`);
  return {
    suffix,
    wrapper: wrapper === undefined ? null : file(root, 'wrapper', wrapper),
    logo: logo === false ? null : logo === undefined ? appFile('logo.svg') : file(root, 'logo', logo),
    title: options.title ?? 'self',
    locale,
    theme: theme ?? null,
    /** outDir of the static catalog, or false when it is not built */
    build: build ? normalizePath(resolve(root, (build !== true && build.outDir) || 'self-dist')) : (false as const)
  };
}

export const isInside = (dir: string, parent: string) =>
  dir === parent || dir.startsWith(parent.replace(/\/$/, '') + '/');

/**
 * `server.fs.allow` with the paths (directories or files) outside the root added, or undefined when nothing has to be added.
 * Without a list, Vite's default (the workspace root) is kept; an explicit list, such as SvelteKit's, is not widened.
 */
export function extendFsAllow(root: string, paths: string[], allow: string[] | undefined): string[] | undefined {
  const outside = paths.filter((p) => !isInside(normalizePath(p), normalizePath(root)));
  return outside.length ? [...(allow ?? [searchForWorkspaceRoot(root)]), ...outside] : undefined;
}
