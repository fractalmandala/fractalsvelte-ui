<!-- @component A ⌘K command launcher on a modal dialog, with fuzzy ranking, highlighted matches and staggered results. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luSearch } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/floating.js';
	import { stagger, vars } from '../../../motion/index.js';
	import { surfaceClass, type OverlaySurface, type OverlayTrigger } from '../dialog/dialog.js';
	import {
		groupCommands,
		marks,
		matchesShortcut,
		type Command
	} from './command.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		/** Whether the palette is open. Bind it, or let the trigger or the global shortcut drive it. */
		open?: boolean;
		/** Called whenever the palette opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** The commands to search, group and rank. */
		commands?: Command[];
		/** A global shortcut that toggles the palette, for example `mod+k`. `mod` is ⌘ on Apple platforms and Ctrl elsewhere. */
		shortcut?: string;
		/** The placeholder of the search field. */
		placeholder?: string;
		/** The panel fill: opaque, or frosted glass. */
		surface?: OverlaySurface;
		/** Shown when the query has no matches. Receives the current query. */
		empty?: Snippet<[string]>;
		/** Replaces the default footer hints. */
		footer?: Snippet;
		/** The element that opens the palette. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		commands = [],
		shortcut,
		placeholder = 'Search commands…',
		surface = 'solid',
		empty,
		footer,
		trigger,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const listId = `${uid}-list`;

	let query = $state('');
	let active = $state(0);
	let field: HTMLInputElement | undefined;

	const groups = $derived(groupCommands(query, commands));
	const flat = $derived(groups.flatMap((group) => group.commands));
	const activeId = $derived(flat[active] ? `${uid}-${flat[active].id}` : undefined);

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
		if (next) {
			query = '';
			active = 0;
			queueMicrotask(() => field?.focus());
		}
	}

	const show = () => setOpen(true);
	const hide = () => setOpen(false);
	const toggle = () => setOpen(!open);

	function move(delta: number) {
		if (flat.length === 0) return;
		active = (active + delta + flat.length) % flat.length;
	}

	function choose(command: Command) {
		command.onSelect();
		hide();
	}

	function onFieldKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const command = flat[active];
			if (command) choose(command);
		} else if (event.key === 'Home') {
			event.preventDefault();
			active = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			active = Math.max(0, flat.length - 1);
		}
	}

	$effect(() => {
		void groups;
		active = 0;
	});

	$effect(() => {
		if (!shortcut) return;
		const onKeydown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.repeat) return;
			const target = event.target as HTMLElement | null;
			if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) && !open) {
				return;
			}
			if (matchesShortcut(event, shortcut)) {
				event.preventDefault();
				toggle();
			}
		};
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': uid,
			onclick: show
		},
		isOpen: open,
		open: show,
		close: hide,
		toggle
	});
</script>

{@render trigger?.(api)}

<dialog
	id={uid}
	class={['dialog open-column sized pop enter-scale radius-lg shad-2xl', surfaceClass[surface], klass]}
	aria-label="Command palette"
	{@attach dialogSync(() => open, setOpen, { dismissible: true })}
	{@attach vars({ size: 'var(--measure-md)' })}
	{...rest}
>
	<div class="row ycenter gap-sm px-lg py-bs bb-sub shrink-0">
		<Icon icon={luSearch} class="text-muted shrink-0" />
		<input
			bind:this={field}
			class="bare grow text-md text-primary"
			type="text"
			{placeholder}
			bind:value={query}
			role="combobox"
			aria-autocomplete="list"
			aria-expanded="true"
			aria-controls={listId}
			aria-activedescendant={activeId}
			onkeydown={onFieldKeydown}
		/>
	</div>
	<div
		id={listId}
		role="listbox"
		class="box gap-xs pad-xs grow min0 scroll-y scroll-thin"
		{@attach stagger({ selector: '[role="option"]', step: 30 })}
	>
		{#key query}
			{#each groups as group (group.group)}
				<div role="group" aria-label={group.group || undefined} class="box">
					{#if group.group}
						<div class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{group.group}</div>
					{/if}
					{#each group.commands as command (command.id)}
						{@const isActive = flat[active]?.id === command.id}
						<div
							id={`${uid}-${command.id}`}
							role="option"
							tabindex="-1"
							aria-selected={isActive}
							class={['item anim-in', isActive && 'highlighted']}
							onclick={() => choose(command)}
							onkeydown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									choose(command);
								}
							}}
						>
							{#if command.icon}
								<Icon icon={command.icon} class="text-secondary shrink-0" />
							{/if}
							<span class="grow truncate">
								{#each marks(command.label, query) as part, i (`${i}:${part.text}`)}
									{#if part.hit}<span class="weight-600 text-theme">{part.text}</span>{:else}{part.text}{/if}
								{/each}
							</span>
							{#if command.shortcut}
								<kbd class="kbd shrink-0 font-mono text-xs text-muted">{command.shortcut}</kbd>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div class="px-sm py-lg text-sm text-muted ta-c">
					{#if empty}
						{@render empty(query)}
					{:else}
						{query.trim() ? `No results for “${query.trim()}”.` : 'No commands.'}
					{/if}
				</div>
			{/each}
		{/key}
	</div>
	<footer class="row wrap ycenter gap-sm px-lg py-sm bt-sub text-xs text-muted shrink-0">
		{#if footer}
			{@render footer()}
		{:else}
			<span class="row ycenter gap-xs"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> to navigate</span>
			<span class="row ycenter gap-xs"><kbd class="kbd">↵</kbd> to select</span>
			<span class="row ycenter gap-xs"><kbd class="kbd">esc</kbd> to close</span>
		{/if}
	</footer>
</dialog>
