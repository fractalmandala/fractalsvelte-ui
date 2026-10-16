<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TabItem {
		id: string;
		label: string;
		icon?: Snippet;
		badge?: string | number;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSize } from '../types';

	export type TabsVariant = 'underline' | 'pill' | 'bordered';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tabs?: TabItem[];
		activeTab?: string;
		variant?: TabsVariant;
		size?: FsSize;
		class?: string;
		/** Panel content for the active tab */
		children?: Snippet;
		extra?: Snippet;
	}

	let {
		tabs = [],
		activeTab = $bindable(''),
		variant = 'underline',
		size = 'lg',
		class: className = '',
		children,
		extra,
		...restProps
	}: Props = $props();

	const uid = $props.id();

	$effect.pre(() => {
		if (!activeTab && tabs.length > 0) {
			const first = tabs.find((t) => !t.disabled);
			if (first) activeTab = first.id;
		}
	});

	// Selected ink per variant, applied to the inner label: on the button itself
	// button[data-variant] would outrank it. Underline draws its rule there too.
	const SELECTED_CLASSES: Record<TabsVariant, string> = {
		underline: 'text-theme bb-str',
		pill: 'text-primary',
		bordered: 'text-primary'
	};
	const BUTTON_VARIANT: Record<TabsVariant, [string, string]> = {
		underline: ['ghost', 'ghost'],
		pill: ['secondary', 'ghost'],
		bordered: ['outline', 'ghost']
	};

	function onkeydown(event: KeyboardEvent, index: number) {
		const enabled = tabs.filter((t) => !t.disabled);
		const cur = enabled.findIndex((t) => t.id === tabs[index].id);
		const next =
			event.key === 'ArrowRight'
				? (cur + 1) % enabled.length
				: event.key === 'ArrowLeft'
					? (cur - 1 + enabled.length) % enabled.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? enabled.length - 1
							: -1;
		if (next === -1 || !enabled.length) return;
		event.preventDefault();
		activeTab = enabled[next].id;
		document.getElementById(`${uid}-tab-${activeTab}`)?.focus();
	}
</script>

<div class="box gap-md {className}" {...restProps}>
	<div class="row ycenter xbetween gap-sm {variant === 'underline' ? 'bb' : ''}">
		<div class="row ycenter gap-xs scroll-x" role="tablist" aria-orientation="horizontal">
			{#each tabs as tab, i (tab.id)}
				{@const active = tab.id === activeTab}
				<button
					type="button"
					id="{uid}-tab-{tab.id}"
					role="tab"
					class="shrink-0"
					data-variant={BUTTON_VARIANT[variant][active ? 0 : 1]}
					data-size={size}
					data-shape={variant === 'pill' ? 'round' : variant === 'underline' ? 'square' : 'modern'}
					disabled={tab.disabled}
					aria-selected={active}
					aria-controls="{uid}-panel"
					tabindex={active ? 0 : -1}
					onclick={() => !tab.disabled && (activeTab = tab.id)}
					onkeydown={(e) => onkeydown(e, i)}
				>
					<span class="row ycenter gap-xs py-xs {active ? SELECTED_CLASSES[variant] : 'text-secondary'}">
						{@render tab.icon?.()}
						<span>{tab.label}</span>
						{#if tab.badge !== undefined}<span class="chip bg-sunken text-secondary">{tab.badge}</span>{/if}
					</span>
				</button>
			{/each}
		</div>
		{#if extra}<div class="row ycenter gap-xs shrink-0">{@render extra()}</div>{/if}
	</div>
	{#if children}
		<div id="{uid}-panel" role="tabpanel" aria-labelledby="{uid}-tab-{activeTab}" tabindex="0">
			{@render children()}
		</div>
	{/if}
</div>
