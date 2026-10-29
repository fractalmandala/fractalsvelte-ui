<!-- @component A card that acts as a button, or a link when given `href`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Pad, Shadow } from '../types';

	interface Props extends HTMLButtonAttributes {
		/** Renders an anchor instead of a button */
		href?: string;
		target?: string;
		rel?: string;
		disabled?: boolean;
		size?: Size;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		padding?: Pad;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		title?: string;
		description?: string;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		media?: Snippet;
		header?: Snippet;
		headerExtra?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		href,
		target,
		rel,
		disabled = false,
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-none',
		padding = 'pad-lg',
		shape = 'curved',
		title,
		description,
		class: className = '',
		onclick,
		media,
		header,
		headerExtra,
		footer,
		children,
		...restProps
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || description || headerExtra));
	// .card-clickable strengthens the border on hover; .link-parent turns the title theme-coloured.
	const shell = $derived(
		`card card-sized card-clickable link-parent box xleft ytop gap-md ta-l wfull el-shape ${size} ${shape} ${padding} ${surface} ${border} ${shadow} ${disabled ? 'disabled' : ''} ${className}`
	);
</script>

{#snippet body()}
	{#if media}<div class="box wfull radius-sm scroll-x">{@render media()}</div>{/if}
	{#if hasHeader}
		{#if header}
			{@render header()}
		{:else}
			<div class="row ytop xbetween gap-sm wfull">
				<div class="box gap-xs min0">
					{#if title}<span class="card-title link-title">{title}</span>{/if}
					{#if description}<span class="card-desc text-secondary">{description}</span>{/if}
				</div>
				{#if headerExtra}<div class="row ycenter gap-xs shrink-0">{@render headerExtra()}</div>{/if}
			</div>
		{/if}
	{/if}
	{#if children}<div class="box gap-sm wfull">{@render children()}</div>{/if}
	{#if footer}<footer class="row ycenter gap-sm pt-sm bt-sub wfull">{@render footer()}</footer>{/if}
{/snippet}

{#if href}
	<a
		href={disabled ? undefined : href}
		{target}
		rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
		class={shell}
		aria-disabled={disabled || undefined}
		{...restProps as HTMLAnchorAttributes}
	>
		{@render body()}
	</a>
{:else}
	<div
		role="button"
		tabindex={disabled ? -1 : 0}
		class={shell}
		aria-disabled={disabled || undefined}
		onclick={(e) => !disabled && onclick?.(e)}
		onkeydown={(e) => {
			if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				onclick?.(e as unknown as MouseEvent);
			}
		}}
		{...restProps as HTMLAttributes<HTMLDivElement>}
	>
		{@render body()}
	</div>
{/if}
