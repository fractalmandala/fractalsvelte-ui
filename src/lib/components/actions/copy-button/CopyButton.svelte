<!-- @component Copies text to the clipboard and confirms it with a spring-morphed check. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luCopy } from '@fractaldesign/icons/lucide';
	import { animate, springScale } from '../../../motion/index.js';
	import type { Shape, Size, Variant } from '../../../internal/tokens.js';
	import Button from '../button/Button.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'children'> {
		/** The text written to the clipboard. */
		text: string;
		/** The accessible name and tooltip while idle. For a button with a visible label this is only the tooltip. */
		label?: string;
		/** What is announced to screen readers, and shown as the label, after a successful copy. */
		copiedLabel?: string;
		/** How long, in milliseconds, the confirmation stays before the icon morphs back. */
		timeout?: number;
		/** Called with the copied text after the clipboard write succeeds. */
		onCopy?: (text: string) => void;
		/** The visual style. */
		variant?: Variant;
		/** The control height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** A visible label. Omit it for a square, icon-only button. */
		children?: Snippet;
	}

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied',
		timeout = 2000,
		onCopy,
		variant = 'ghost',
		size = 'md',
		textSize,
		shape = 'modern',
		class: klass,
		onclick,
		children,
		...rest
	}: Props = $props();

	let copied = $state(false);
	let idle = $state<HTMLElement>();
	let timer: ReturnType<typeof setTimeout> | undefined;

	// The idle glyph springs out as the confirmation springs in (the check uses an enter transition).
	$effect(() => {
		if (!idle) return;
		animate(idle, { scale: copied ? 0.4 : 1, opacity: copied ? 0 : 1 }, { spring: 'snappy' });
	});
	$effect(() => () => clearTimeout(timer));

	async function copy(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(event);
		if (event.defaultPrevented) return;
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return;
		}
		copied = true;
		onCopy?.(text);
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), timeout);
	}
</script>

<Button
	{variant}
	{size}
	{textSize}
	{shape}
	class={[!children && 'btn-icon', klass]}
	aria-label={children ? undefined : label}
	title={copied ? copiedLabel : label}
	onclick={copy}
	{...rest}
>
	<span class="relative grid center">
		<span class="grid center motion" bind:this={idle}>
			<Icon icon={luCopy} />
		</span>
		{#if copied}
			<span class="cover grid center" in:springScale={{ spring: 'bouncy', start: 0.4 }} out:springScale={{ spring: 'snappy', start: 0.4 }}>
				<Icon icon={luCheck} class="text-success" />
			</span>
		{/if}
	</span>
	{#if children}
		{#if copied}{copiedLabel}{:else}{@render children()}{/if}
	{/if}
</Button>

<span class="sr-only" role="status" aria-live="polite">{copied ? copiedLabel : ''}</span>
