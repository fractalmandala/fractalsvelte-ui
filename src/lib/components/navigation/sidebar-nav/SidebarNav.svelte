<!-- @component A vertical navigation tree with groups, badges and an icon-only rail that springs to width. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronRight } from '@fractaldesign/icons/lucide';
	import type { ChildTextSize, Pad, Shape, Size, Surface } from '../../../internal/tokens.js';
	import type {  SidebarItem  } from './items.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		items: SidebarItem[];
		current?: string;
		collapsed?: boolean;
		onCollapsedChange?: (collapsed: boolean) => void;
		shortcut?: string | false;
		mobileOpen?: boolean;
		label?: string;
		size?: Size;
		shape?: Shape;
		childTextSize?: ChildTextSize;
		surface?: Surface;
	}

	let {
		items,
		current,
		collapsed = $bindable(false),
		onCollapsedChange,
		shortcut = 'b',
		mobileOpen = $bindable(false),
		label = 'Sidebar',
		size = 'h-md',
		shape = 'round',
		childTextSize = 'text-xs',
		surface = 'elevated',
		class: className,
		...rest
	}: Props = $props();

	function handleShortcut(event: KeyboardEvent) {
		if (!shortcut) return;
		if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
		if (event.key.toLowerCase() !== shortcut.toLowerCase()) return;
		const target = event.target as HTMLElement | null;
		if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
			return;
		}
		event.preventDefault();
		const next = !collapsed;
		collapsed = next;
		onCollapsedChange?.(next);
	}

	let openGroups = $state<Record<string, boolean>>({});

	function containsCurrent(item: SidebarItem): boolean {
		if (item.href && item.href === current) return true;
		return item.children?.some(containsCurrent) ?? false;
	}

	function groupKey(item: SidebarItem, path: string): string {
		return `${path}/${item.label ?? ''}`;
	}

	function isOpen(item: SidebarItem, path: string): boolean {
		const key = groupKey(item, path);
		if (key in openGroups) return openGroups[key] ?? false;
		if (containsCurrent(item)) return true;
		return item.defaultOpen ?? false;
	}

	function toggle(item: SidebarItem, path: string) {
		if (item.disabled || collapsed) return;
		const key = groupKey(item, path);
		openGroups = { ...openGroups, [key]: !isOpen(item, path) };
	}

	function itemClass(active: boolean, disabled: boolean) {
		return [
			'item',
			collapsed && 'xcenter',
			active && 'selected',
			disabled && 'disabled'
		];
	}
</script>

{#snippet leaf(item: SidebarItem)}
	{@const active = !!item.href && item.href === current}
	{#if item.separator}
		<div class="bb my-xs" role="separator"></div>
	{:else if item.href && !item.disabled}
		<a
			href={item.href}
			class={['relative', ...itemClass(active, false)]}
			aria-current={active ? 'page' : undefined}
			title={collapsed ? item.label : undefined}
		>
			{#if item.icon}
				<Icon icon={item.icon} class="shrink-0" />
			{/if}
			{#if !collapsed}
				<span class="grow truncate">{item.label}</span>
				{#if item.badge !== undefined}
					<span class={['badge state-selected px-sm tabular-nums shrink-0', shape, childTextSize, size]}>{item.badge}</span>
				{/if}
			{:else}
				<span class="hint hint-right">{item.label}</span>
			{/if}
		</a>
	{:else}
		<div class={['relative', ...itemClass(active, !!item.disabled)]} aria-disabled={item.disabled || undefined}>
			{#if item.icon}
				<Icon icon={item.icon} class="shrink-0" />
			{/if}
			{#if !collapsed}
				<span class="grow truncate">{item.label}</span>
				{#if item.badge !== undefined}
					<span class={['badge state-selected px-sm tabular-nums shrink-0', shape, childTextSize, size]}>{item.badge}</span>
				{/if}
			{:else if item.label}
				<span class="hint hint-right">{item.label}</span>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet branch(item: SidebarItem, path: string)}
	{@const open = isOpen(item, path)}
	{#if collapsed}
		<div class="relative">
			<div class={itemClass(containsCurrent(item), !!item.disabled)}>
				{#if item.icon}
					<Icon icon={item.icon} class="shrink-0" />
				{/if}
				<span class="hint hint-right">{item.label}</span>
			</div>
		</div>
	{:else}
		<button
			type="button"
			class={itemClass(false, !!item.disabled)}
			aria-expanded={open}
			disabled={item.disabled}
			onclick={() => toggle(item, path)}
		>
			{#if item.icon}
				<Icon icon={item.icon} class="shrink-0" />
			{/if}
			<span class="grow truncate ta-l">{item.label}</span>
			{#if item.badge !== undefined}
				<span class={['badge state-selected px-sm tabular-nums shrink-0', shape, childTextSize, size]}>{item.badge}</span>
			{/if}
			<span class={['caret quarter spring spring-snappy', open && 'open']}>
				<Icon icon={luChevronRight} />
			</span>
		</button>
		<div class={['collapse spring spring-snappy', open && 'open']}>
			<div>
				<div class="column pl-sm">
					{#each item.children ?? [] as child, i (child.href ?? child.label ?? i)}
						{@render entry(child, groupKey(item, path))}
					{/each}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet entry(item: SidebarItem, path: string)}
	{#if item.children?.length}
		{@render branch(item, path)}
	{:else}
		{@render leaf(item)}
	{/if}
{/snippet}

<svelte:window onkeydown={handleShortcut} />

{#if mobileOpen}
	<div role="presentation" class="rail-backdrop" onclick={() => (mobileOpen = false)}></div>
{/if}

<nav
	aria-label={label}
	class={[
		'rail spring spring-snappy column gap-xs br',
		surface,
		'pad-sm',
		collapsed && 'collapsed',
		mobileOpen && 'mobile-drawer mobile-open',
		className
	]}
	{...rest}
>
	{#each items as item, i (item.href ?? item.label ?? i)}
		{@render entry(item, '')}
	{/each}
</nav>
