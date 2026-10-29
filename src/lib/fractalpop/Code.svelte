<script lang="ts">
  // Vendored from fractalpop-main/packages/svelte/src/Code.svelte, rewired to the local core.
  import { parse, generate, lang as canonicalizeLang, getLanguageConfig, themeStyle, sveltekit, type Theme, type DisplayOptions } from './index.js'
  import type { AstElement } from './shared.js'
  import type { Snippet } from 'svelte'
  import { Icon } from '@fractaldesign/icons'
  import { luCopy, luCheck } from '@fractaldesign/icons/lucide'
	import Button from '$lib/styler/actions/Button.svelte';

  interface Props {
    code?: string
    /** Source passed as children-style prop; `code` wins if both are set. */
    children?: never
    lang?: string
    theme?: Theme
    title?: string | null
    controls?: boolean
    lineNumbers?: boolean
    lineNumbersWidth?: string
    highlightLines?: (number | [number, number])[]
    startingLineNumber?: number
    wrapLongLines?: boolean
    padding?: string
    fontSize?: string | number
    cx?: DisplayOptions['cx']
    mark?: DisplayOptions['mark']
    markLine?: DisplayOptions['markLine']
    /** Show a copy-to-clipboard button at the right end of the header strip. */
    copyable?: boolean
    /** Extra content for the left side of the header strip (e.g. tabs). */
    header?: Snippet
    class?: string
    style?: string
  }

  let {
    code = '',
    lang,
    theme = sveltekit,
    title = null,
    controls = false,
    lineNumbers = false,
    lineNumbersWidth,
    highlightLines = [],
    startingLineNumber = 1,
    wrapLongLines = true,
    padding,
    fontSize,
    cx,
    mark,
    markLine,
    copyable = true,
    header,
    class: className = '',
    style = '',
  }: Props = $props()

  const config = $derived(lang ? getLanguageConfig(canonicalizeLang(lang) ?? lang) : undefined)
  const lines = $derived(generate(parse(code, config), { cx, mark, markLine }))

  const highlighted = $derived.by(() => {
    const set = new Set<number>()
    for (const l of highlightLines) {
      if (Array.isArray(l)) for (let i = Math.max(1, l[0]); i <= l[1]; i++) set.add(i)
      else set.add(l)
    }
    return set
  })

  const rootStyle = $derived(
    [
      `--fp-font-size:${typeof fontSize === 'number' ? fontSize + 'px' : (fontSize ?? 'inherit')}`,
      `--fp-line-number-width:${lineNumbersWidth ?? '2.5rem'}`,
      `--fp-padding:${padding ?? '2rem'}`,
      themeStyle(theme),
      style,
    ].filter(Boolean).join(';'),
  )

  let copied = $state(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch (err) {
      console.error('Failed to copy code to clipboard', err)
    }
  }

  const tokenText = (t: AstElement) => { const c = t.children[0]; return c && c.type === 'text' ? c.value : '' }

  const styleString = (s: Record<string, unknown> | undefined) =>
    s ? Object.entries(s).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`).join(';') : ''
</script>


<div class="fp-code radius-md border {className}" style={rootStyle} data-fp-code data-fp-line-numbers={lineNumbers}>
  {#if header || title || controls || copyable}
    <div class="fp-code__header row ycenter xbetween gap-xs pad-xs bb bg-panel" data-fp-header>
      <div class="row ycenter gap-xs">
        {#if controls}<div class="fp-code__controls"><span></span><span></span><span></span></div>{/if}
        {#if title}<span class="fp-code__title">{title}</span>{/if}
        {@render header?.()}
      </div>
      {#if copyable}
        <button type="button" class="fp-code__copy" onclick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
          <Icon icon={copied ? luCheck : luCopy} />
        </button>
      {/if}
    </div>
  {/if}
  <pre class="fp-code__pre py-lg" class:wrap={wrapLongLines}><code>{#each lines as line, i}<span
        class={line.properties.className as string}
        style={styleString(line.properties.style as Record<string, unknown>)}
        data-highlight={highlighted.has(i + 1) || undefined}
        >{#if lineNumbers}<span class="fp-code__ln">{startingLineNumber + i}</span>{/if}{#each line.children as AstElement[] as token}<span
            class={token.properties.className as string}
            style={styleString(token.properties.style as Record<string, unknown>)}
            >{tokenText(token)}</span>{/each}</span>{/each}</code></pre>
</div>

<style>
  /* sveltekit theme uses light-dark(); follow fractalstyler's data-mode */
  :global([data-mode='light']) .fp-code { color-scheme: light; }
  :global([data-mode='dark']) .fp-code { color-scheme: dark; }
  .fp-code { font-family: var(--font-mono); font-size: var(--text-sm, inherit); letter-spacing: -0.04rem; line-height: 1.6; overflow: hidden; position: relative; }
  .fp-code__copy {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.35rem; border: 0; border-radius: 0.375rem; background: transparent;
    color: inherit; opacity: 0.6; cursor: pointer;
  }
  .fp-code__copy:hover, .fp-code__copy:focus-visible { opacity: 1; }
  .fp-code__controls { display: inline-flex; width: 52px; gap: 6px; font-family: var(--font-sans) }
  .fp-code__controls span { width: 10px; height: 10px; border-radius: 50%; background: var(--fp-control-color, currentColor); }
  .fp-code__controls span:nth-child(1) { background: #ff5f57; }
  .fp-code__controls span:nth-child(2) { background: #febc2e; }
  .fp-code__controls span:nth-child(3) { background: #28c840; }
  .fp-code__title { color: var(--fp-title-color, currentColor); font-family: var(--fp-font-family, inherit); }
  .fp-code__pre { margin: 0; padding: calc(var(--fp-padding) * 0.5) 0; overflow-x: auto; white-space: normal; }
  .fp-code__pre.wrap { white-space: normal; }
  .fp-code code { display: block; font-family: var(--font-mono); }
  .fp-code :global(.fp__line) { display: block; width: 100%; min-height: 1lh; padding: 0 var(--fp-padding); white-space: pre; }
  .fp-code[data-fp-line-numbers='true'] :global(.fp__line) { padding-left: var(--fp-line-number-width); }
  .fp-code :global(.fp__line[data-highlight]) { background: var(--fp-line-highlight-color); }
  .fp-code__ln {
    display: inline-block; min-width: calc(var(--fp-line-number-width) - 14px);
    margin-left: calc(var(--fp-line-number-width) * -1); margin-right: 14px;
    text-align: right; user-select: none; color: var(--fp-line-number-color, currentColor); opacity: 0.6;
  }
</style>
