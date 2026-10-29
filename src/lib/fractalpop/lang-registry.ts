/** Mutable language metadata registry with alias/extension normalization. */
import type { ParseOptions } from './core.js'
import {
  getLanguageConfig,
  registerLanguageConfig,
  resetLanguageConfigRegistry,
} from './lang-configs.js'
import { config as typescriptConfig } from './lang/typescript.js'
import { config as plaintextConfig } from './lang/plaintext.js'

export interface Language {
  id: string
  extension: string
  aliases: readonly string[]
}

const languageRegistry = new Map<string, Language>()

function normalizeLanguageName(value: string): string {
  return value.trim().toLowerCase().replace(/^\./, '')
}

function registerName(name: string, language: Language): void {
  const normalized = normalizeLanguageName(name)
  if (!normalized) return
  const existing = languageRegistry.get(normalized)
  if (existing && existing.id !== language.id) {
    throw new Error(`Language name "${normalized}" is shared by "${existing.id}" and "${language.id}"`)
  }
  languageRegistry.set(normalized, language)
}

export function registerLanguage(language: Language, config?: ParseOptions): void {
  const names = new Set([language.id, language.extension, ...language.aliases])
  for (const name of names) {
    registerName(name, language)
  }
  if (config) {
    registerLanguageConfig(language.id, config)
  }
}

export function setDefaults(languages: readonly Language[]): void
export function setDefaults(configs: Record<string, ParseOptions>): void
export function setDefaults(
  input: readonly Language[] | Record<string, ParseOptions>,
): void {
  resetLanguageRegistry()
  resetLanguageConfigRegistry()
  if (Array.isArray(input)) {
    for (const language of input) {
      registerLanguage(language)
    }
  } else {
    for (const [id, config] of Object.entries(input)) {
      const language = allLanguages.find((l) => l.id === id)
      if (language) {
        registerLanguage(language, config)
      } else {
        registerLanguage({ id, extension: id, aliases: [] }, config)
      }
    }
  }
}

/** Find canonical language metadata by name, alias, or extension. */
export function findLanguage(name: string): Language | undefined {
  if (typeof name !== 'string') return undefined
  return languageRegistry.get(normalizeLanguageName(name))
}

/** Resolve a name/alias/extension to its canonical language id. */
export function lang(name: string): string | undefined {
  return findLanguage(name)?.id
}

/** Alias for {@link lang}. */
export const canonicalizeLang = lang

export function getRegisteredLanguages(): readonly Language[] {
  return [...new Set(languageRegistry.values())]
}

export function resetLanguageRegistry(): void {
  languageRegistry.clear()
}

export { getLanguageConfig, resetLanguageConfigRegistry }

export const allLanguages: readonly Language[] = [
  { id: 'javascript', extension: 'js', aliases: ['jsx', 'node'] },
  { id: 'typescript', extension: 'ts', aliases: ['tsx'] },
  { id: 'css', extension: 'css', aliases: [] },
  { id: 'scss', extension: 'scss', aliases: [] },
  { id: 'sass', extension: 'sass', aliases: ['indented-sass'] },
  { id: 'html', extension: 'html', aliases: ['htm', 'xml'] },
  { id: 'svelte', extension: 'svelte', aliases: [] },
  { id: 'plaintext', extension: 'txt', aliases: ['text', 'plain'] },
  { id: 'json', extension: 'json', aliases: ['jsonc'] },
  { id: 'shell', extension: 'sh', aliases: ['bash', 'zsh'] },
]

setDefaults({
  typescript: typescriptConfig,
  plaintext: plaintextConfig,
})
