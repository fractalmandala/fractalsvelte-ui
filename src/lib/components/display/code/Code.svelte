<!-- @component A highlighted code block with a copy button, or a short inline snippet. -->

<script lang="ts">
	import { maxHeightStyle } from '../../../internal/helpers.js';
	import type { ComponentProps } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { luCheck, luCopy } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { highlight, type HighlightLang } from '../../../internal/highlight.js';
	import { vars } from '../../../motion/index.js';
	import { type Pad, type Shape, type Size, type Surface, type TextColor, type TextSize } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		code: string;
		lang?: HighlightLang;
		filename?: string;
		showLineNumbers?: boolean;
		highlightLines?: number[] | string;
		wrap?: boolean;
		maxHeight?: Size | string;
		form?: 'block' | 'inline';
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		surface?: Surface;
		pad?: Pad;
		copyButtonProps?: ComponentProps<typeof Button>;
	}

	let {
		copyButtonProps,
		code,
		lang = 'ts',
		filename,
		showLineNumbers = false,
		highlightLines,
		wrap = false,
		maxHeight,
		form = 'block',
		textSize = 'text-sm',
		textColor = 'text-secondary',
		shape = 'curved',
		surface = 'paneled',
		pad = 'pad-xs',
		class: className,
		...rest
	}: Props = $props();

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

	const blockClasses = $derived(['box', 'ta-l', 'divided', surface, shape, 'overflow-hidden', className]);
	const preClasses = $derived([
		'code',
		'scroll-y',
		'scroll-thin',
		showLineNumbers && 'numbered',
		wrap && 'soft-wrap',
		maxHeight && `max-h-${String(maxHeight).replace(/^h-/, '')}`,
		maxHeight && 'capped'
	]);
</script>

{#if form === 'inline'}
	<code class={['font-mono ta-l', textSize, surface, pad, shape, className]} {...rest}>{code}</code>
{:else}
	<figure class={blockClasses} {...rest}>
		<figcaption class={['row xbetween ycenter gap-sm', 'pad-sm']}>
			<span class={['truncate', textSize, textColor]}>{filename ?? lang}</span>
			<Button
				variant="ghost"
				size="h-xs"
				{...copyButtonProps}
				class="btn-icon"
				icon={copied ? luCheck : luCopy}
				onclick={copyCode}
				aria-label={copied ? 'Copied' : 'Copy code'}
			/>
		</figcaption>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scrollable region must be keyboard-focusable -->
		<pre
			class={preClasses}
			tabindex="0"
			aria-label={filename ?? `${lang} code`}
			{@attach vars({ 'max-height': maxHeightStyle(maxHeight) })}
		>
		{#each lines as line, i (i)}<span class={['code-line', marked.has(i + 1) && 'marked']}><span>{#each line as tok, j (j)}{#if tok.cls}<span class={tok.cls}>{tok.text}</span>{:else}{tok.text}{/if}{/each}</span></span>{/each}
		</pre>
	</figure>
{/if}
