<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface CommandItem {
		id: string;
		label: string;
		description?: string;
		icon?: Snippet;
		shortcut?: string;
		onselect?: () => void;
	}

	export interface CommandGroup {
		category: string;
		items: CommandItem[];
	}
</script>

<script lang="ts">
	import { Icon } from 'fractalicons';
	import { luSearch } from 'fractalicons/lucide';
	import Modal from './Modal.svelte';

	interface Props {
		open?: boolean;
		/** Letter paired with ⌘ / Ctrl that toggles the palette */
		shortcut?: string;
		placeholder?: string;
		emptyMessage?: string;
		groups?: CommandGroup[];
		class?: string;
		onselect?: (itemId: string) => void;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		shortcut = 'k',
		placeholder = 'Type a command or search…',
		emptyMessage = 'No results found.',
		groups = [],
		class: className = '',
		onselect,
		trigger,
		children
	}: Props = $props();

	const uid = $props.id();
	let query = $state('');
	let active = $state(0);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return groups;
		return groups
			.map((g) => ({
				category: g.category,
				items: g.items.filter((i) => i.label.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
			}))
			.filter((g) => g.items.length > 0);
	});
	const flat = $derived(filtered.flatMap((g) => g.items));

	$effect(() => {
		if (open) {
			query = '';
			active = 0;
		}
	});

	$effect(() => {
		void query;
		active = 0;
	});

	function choose(item: CommandItem) {
		item.onselect?.();
		onselect?.(item.id);
		open = false;
	}

	function onWindowKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase()) {
			e.preventDefault();
			open = !open;
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' && flat.length) {
			e.preventDefault();
			active = (active + 1) % flat.length;
		} else if (e.key === 'ArrowUp' && flat.length) {
			e.preventDefault();
			active = (active - 1 + flat.length) % flat.length;
		} else if (e.key === 'Enter' && flat[active]) {
			e.preventDefault();
			choose(flat[active]);
		}
	}
</script>

<svelte:window onkeydown={onWindowKey} />

{@render trigger?.({ open: () => (open = true) })}

<Modal bind:open placement="top" aria-label="Command palette" panelClass="prose wfull {className}">
	<div class="row ycenter gap-sm px-md bb">
		<Icon icon={luSearch} class="text-muted shrink-0" />
		<input
			bind:value={query}
			type="text"
			class="input grow min0"
			data-variant="ghost"
			data-size="lg"
			{placeholder}
			role="combobox"
			aria-expanded="true"
			aria-controls="{uid}-list"
			aria-activedescendant={flat[active] ? `${uid}-${flat[active].id}` : undefined}
			aria-autocomplete="list"
			{onkeydown}
		/>
		<kbd class="chip mono bg-sunken text-muted border shrink-0">ESC</kbd>
	</div>
	<div id="{uid}-list" role="listbox" class="box gap-sm pad-xs scroll-y">
		{#if children}
			{@render children()}
		{:else if filtered.length === 0}
			<p class="text-body-sm text-muted ta-c py-xl">{emptyMessage}</p>
		{:else}
			{#each filtered as group (group.category)}
				<div class="box gap-xs" role="group" aria-label={group.category}>
					<span class="nav-header text-muted tt-u ls-wide-lg">{group.category}</span>
					{#each group.items as item (item.id)}
						{@const isActive = flat[active]?.id === item.id}
						<!-- svelte-ignore a11y_click_events_have_key_events (Enter is handled on the input) -->
						<div
							id="{uid}-{item.id}"
							role="option"
							tabindex="-1"
							aria-selected={isActive}
							class="row ycenter gap-sm px-sm py-sm radius-sm {isActive ? 'bg-sunken' : ''}"
							onclick={() => choose(item)}
							onpointerenter={() => (active = flat.indexOf(item))}
						>
							{#if item.icon}<span class="row ycenter shrink-0 text-muted">{@render item.icon()}</span>{/if}
							<div class="box grow min0">
								<span class="text-sm weight-500 truncate">{item.label}</span>
								{#if item.description}<span class="text-body-sm text-muted truncate">{item.description}</span>{/if}
							</div>
							{#if item.shortcut}<kbd class="chip mono bg-sunken text-muted shrink-0">{item.shortcut}</kbd>{/if}
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</Modal>
