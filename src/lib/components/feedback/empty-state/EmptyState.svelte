<!-- @component A centred placeholder for a view that has nothing to show yet, with an optional next step. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { padClass, textClass, type Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		/** An icon drawn above the title. */
		icon?: IconData;
		/** The heading, such as "No deployments yet". */
		title?: string;
		/** A short explanation, set under the title. */
		description?: string;
		/** The scale of the type, icon and padding. */
		size?: Size;
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
		size = 'md',
		frame = 'none',
		actions,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const iconScale: Record<Size, string> = {
		xs: 'text-lg',
		sm: 'text-xl',
		md: 'text-2xl',
		lg: 'text-3xl',
		xl: 'text-4xl'
	};

	const frameClass = $derived(
		frame === 'bordered' ? 'border modern' : frame === 'dashed' ? 'border-dashed modern' : ''
	);
</script>

<div
	class={['box xcenter gap-md ta-c', padClass[size], textClass[size], frameClass, klass]}
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
