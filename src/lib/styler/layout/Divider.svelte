<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation, FsSpace } from '../types';
	import { MY, MX } from '../classes';

	/** Line weight from the partition-law border set (.bb-sub / .bb / .bb-str). */
	export type DividerVariant = 'subtle' | 'default' | 'strong';
	export type DividerLabelPosition = 'start' | 'center' | 'end';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: Orientation;
		variant?: DividerVariant;
		spacing?: FsSpace;
		label?: string;
		labelPosition?: DividerLabelPosition;
		class?: string;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		variant = 'default',
		spacing = 'md',
		label,
		labelPosition = 'center',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const H_LINE_CLASSES: Record<DividerVariant, string> = { subtle: 'bb-sub', default: 'bb', strong: 'bb-str' };
	const V_LINE_CLASSES: Record<DividerVariant, string> = { subtle: 'br-sub', default: 'br', strong: 'br-str' };
	const hasContent = $derived(Boolean(label || children));
</script>

{#if orientation === 'vertical'}
	<!-- A border on an empty flex item: .hfull fills a fixed-height row, and in
	     an auto-height row the default stretch alignment does the same. -->
	<div role="separator" aria-orientation="vertical" class="shrink-0 hfull {V_LINE_CLASSES[variant]} {MX[spacing]} {className}" {...restProps}></div>
{:else if hasContent}
	<div role="separator" class="row ycenter gap-sm wfull {MY[spacing]} {className}" {...restProps}>
		{#if labelPosition !== 'start'}<span class="grow {H_LINE_CLASSES[variant]}"></span>{/if}
		<span class="text-sm text-muted shrink-0">{#if children}{@render children()}{:else}{label}{/if}</span>
		{#if labelPosition !== 'end'}<span class="grow {H_LINE_CLASSES[variant]}"></span>{/if}
	</div>
{:else}
	<div role="separator" class="wfull {H_LINE_CLASSES[variant]} {MY[spacing]} {className}" {...restProps}></div>
{/if}
