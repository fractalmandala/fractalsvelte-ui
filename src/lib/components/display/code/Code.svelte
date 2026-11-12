<!-- @component A highlighted code block with a copy button, or a short inline snippet. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { luCheck, luCopy } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { highlight, type HighlightLang } from '../../../internal/highlight.js';
	import type { Size } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The source to display. */
		code: string;
		/** The language used to highlight the source. */
		lang?: HighlightLang;
		/** An optional file name shown in the toolbar. */
		filename?: string;
		/** Draws a gutter of line numbers. */
		showLineNumbers?: boolean;
		/** 1-based line numbers to mark, or a string such as "3-5,8". */
		highlightLines?: number[] | string;
		/** Soft-wraps long lines instead of scrolling horizontally. */
		wrap?: boolean;
		/** Caps the block's height on the measure ladder and scrolls the rest. */
		maxHeight?: Size;
		/** `block` is a highlighted panel with a copy button; `inline` is a short snippet in running text. */
		variant?: 'block' | 'inline';
	}

	let {
		code,
		lang = 'ts',
		filename,
		showLineNumbers = false,
		highlightLines,
		wrap = false,
		maxHeight,
		variant = 'block',
		class: klass,
		...rest
	}: Props = $props();

	const maxHClass: Record<Size, string> = {
		xs: 'max-h-xs',
		sm: 'max-h-sm',
		md: 'max-h-md',
		lg: 'max-h-lg',
		xl: 'max-h-xl'
	};

	const lines = $derived(highlight(code, lang));
	const marked = $derived(parseLines(highlightLines));

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		return () => clearTimeout(timer);
	});

	async function copyCode(): Promise<void> {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => {
				copied = false;
			}, 1500);
		} catch {
			copied = false;
		}
	}

	function parseLines(input: number[] | string | undefined): Set<number> {
		const out = new Set<number>();
		if (input === undefined) return out;
		const parts = Array.isArray(input)
			? input.map(String)
			: input.split(',');
		for (const part of parts) {
			const [rawStart, rawEnd] = part.trim().split('-');
			const start = Number(rawStart);
			if (!Number.isFinite(start)) continue;
			const end = rawEnd === undefined ? start : Number(rawEnd);
			if (!Number.isFinite(end)) {
				out.add(start);
				continue;
			}
			const from = Math.min(start, end);
			const to = Math.max(start, end);
			for (let n = from; n <= to; n++) out.add(n);
		}
		return out;
	}

	const blockClasses = $derived([
		'box',
		'divided',
		'border-subtle',
		'curved',
		'overflow-hidden',
		'bg-panel',
		klass
	]);
	const preClasses = $derived([
		'code',
		'scroll-y',
		'scroll-thin',
		showLineNumbers && 'numbered',
		wrap && 'soft-wrap',
		maxHeight && maxHClass[maxHeight]
	]);
</script>

{#if variant === 'inline'}
	<code class={['font-mono', 'text-sm', 'pad-xs', 'bg-panel', 'curved', klass]} {...rest}>{code}</code>
{:else}
	<figure class={blockClasses} {...rest}>
		<figcaption class="row xbetween ycenter gap-sm pad-sm">
			<span class="text-sm text-secondary truncate">{filename ?? lang}</span>
			<Button
				variant="ghost"
				size="xs"
				class="btn-icon"
				icon={copied ? luCheck : luCopy}
				onclick={copyCode}
				aria-label={copied ? 'Copied' : 'Copy code'}
			/>
		</figcaption>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scrollable region must be keyboard-focusable -->
		<pre class={preClasses} tabindex="0" aria-label={filename ?? `${lang} code`}>
			{#each lines as line, i (i)}
				<span class={['code-line', marked.has(i + 1) && 'marked']}>
					<span>
						{#each line as tok, j (j)}
							{#if tok.cls}<span class={tok.cls}>{tok.text}</span>{:else}{tok.text}{/if}
						{/each}
					</span>
				</span>
			{/each}
		</pre>
	</figure>
{/if}
