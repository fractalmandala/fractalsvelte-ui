<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luCopy } from '@fractaldesign/icons/lucide';
	import { highlight, type HighlightLang } from '../lib/internal/highlight.js';

	interface Props {
		/** The source to show. */
		code: string;
		/** The language to highlight it as. */
		lang?: HighlightLang;
		/** A caption (file name, command) shown in a header bar. */
		title?: string;
		/** Caps the height and scrolls. */
		tall?: boolean;
		/** No frame — for code inside another surface. */
		bare?: boolean;
		class?: string;
	}

	let { code, lang = 'svelte', title, tall = false, bare = false, class: klass }: Props = $props();

	const text = $derived(code.replace(/\n+$/, ''));
	const lines = $derived(highlight(text, lang));
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

{#snippet copyButton(cls: string)}
	<button type="button" class={['ghost h-bs btn-icon mincurved text-muted', cls]} aria-label={copied ? 'Copied' : 'Copy code'} onclick={copy}>
		<Icon icon={copied ? luCheck : luCopy} />
	</button>
{/snippet}

<div class={['relative min0', !bare && 'border radius-bs bg-panel overflow-hidden', klass]}>
	{#if title}
		<div class="row xbetween ycenter gap-sm pl-lg pr-xs py-xs bb-sub">
			<span class="text-xs font-mono text-muted truncate">{title}</span>
			{@render copyButton('')}
		</div>
	{:else}
		{@render copyButton('pin-tr')}
	{/if}
	<pre class={['code', tall && 'scroll-tall']}><code>{#each lines as line, i (i)}{#each line as t, j (j)}{#if t.cls}<span class={t.cls}>{t.text}</span>{:else}{t.text}{/if}{/each}{#if i < lines.length - 1}{'\n'}{/if}{/each}</code></pre>
</div>
