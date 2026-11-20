<!-- @component A centred placeholder for a view that has nothing to show yet, with an optional next step. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { type Pad, type Size, type TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		/** An icon drawn above the title. */
		icon?: IconData;
		/** The heading, such as "No deployments yet". */
		title?: string;
		/** A short explanation, set under the title. */
		description?: string;
		/** The scale of the icon. */
		size?: Size;
		/** Padding on the shared pad ladder. */
		pad?: Pad;
		/** Text scale on the shared text ladder. */
		textSize?: TextSize;
		/** An optional frame around the block: a hairline, or a dashed one. */
		frame?: 'none' | 'bordered' | 'dashed';
		/** Controls drawn under the description — usually the next action. */
		actions?: Snippet;
		/** Alternative body content; used when `description` is not enough. */
		children?: Snippet;
	}

	let {
		icon,
		title,
		description,
		size = 'h-lg',
		pad = 'pad-lg',
		textSize,
		frame = 'none',
		actions,
		children,
		class: className,
		...rest
	}: Props = $props();

	const iconScale: Record<Size, string> = {
		'h-xs': 'text-bs',
		'h-sm': 'text-lg',
		'h-md': 'text-xl',
		'h-bs': 'text-2xl',
		'h-lg': 'text-3xl',
		'h-xl': 'text-4xl',
		'h-2xl': 'text-4xl',
		'h-3xl': 'text-4xl'
	};

	const frameClass = $derived(
		frame === 'bordered' ? 'border modern' : frame === 'dashed' ? 'border-dashed modern' : ''
	);
</script>

<div
	class={['box xcenter gap-md ta-c', pad, textSize, frameClass, className]}
	{...rest}
>
	{#if icon}
		<span class={['text-muted lh14', iconScale[size]]}>
			<Icon icon={icon} />
		</span>
	{/if}
	<div class="box xcenter gap-xs measure-sm">
		{#if title}
			<p class="weight-600 lh14">{title}</p>
		{/if}
		{#if description}
			<p class="text-sm text-secondary lh15">{description}</p>
		{/if}
		{#if children}
			<div class="text-sm text-secondary lh15">{@render children()}</div>
		{/if}
	</div>
	{#if actions}
		<div class="row ycenter wrap gap-sm">{@render actions()}</div>
	{/if}
</div>
