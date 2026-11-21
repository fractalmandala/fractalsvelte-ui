<!-- @component Copies text to the clipboard and confirms it with a spring-morphed check. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luCopy } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import type {  ChildTextColor, Shape, Size, TextColor, TextSize, Variant  } from '../../../internal/tokens.js';
	import Button from '../button/Button.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'children' | 'disabled'> {
		text: string;
		label?: string;
		copiedLabel?: string;
		timeout?: number;
		onCopy?: (text: string) => void;
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		shape?: Shape;
		children?: Snippet;
		disabled?: boolean | null;
	}

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied',
		timeout = 2000,
		onCopy,
		variant = 'secondary',
		size = 'h-lg',
		textSize = 'text-sm',
		textColor,
		childTextColor = 'text-success',
		shape = 'rect',
		class: className,
		onclick,
		children,
		...rest
	}: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(timer));

	async function copy(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(event);
		if (event.defaultPrevented) return;
		try {
			await navigator.clipboard?.writeText(text);
		} catch {
			// Still confirm copy state and notify callback when clipboard access is restricted.
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
	class={[!children && 'btn-icon', className]}
	aria-label={children ? undefined : label}
	title={copied ? copiedLabel : label}
	onclick={copy}
	{...rest}
>
	{#if children}
		{#if copied}{copiedLabel}{:else}{@render children()}{/if}
	{:else if copied}
		<span class="inline-flex" in:springScale={{ spring: 'bouncy', start: 0.4 }}>
			<Icon icon={luCheck} class={childTextColor} />
		</span>
	{:else}
		<Icon icon={luCopy} />
	{/if}
</Button>

<span class="sr-only" role="status" aria-live="polite">{copied ? copiedLabel : ''}</span>
