<!-- @component A ⌘K command launcher on a modal dialog, with fuzzy ranking, highlighted matches and staggered results. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLDialogAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luSearch } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/helpers.js';
	import type { ChildTextColor, ChildTextSize, Pad, TextColor, TextSize, Surface } from '../../../internal/tokens.js';
	import { stagger, vars } from '../../../motion/index.js';
	import {type OverlayTrigger} from '../dialog/dialog.js';
	import {
		groupCommands,
		marks,
		matchesShortcut,
		type Command
	} from './command.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		commands?: Command[];
		shortcut?: string;
		placeholder?: string;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		bodyTextSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		surface?: Surface;
		empty?: Snippet<[string]>;
		footer?: Snippet;
		trigger?: Snippet<[OverlayTrigger]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		commands = [],
		shortcut,
		placeholder = 'Search commands…',
		textSize = 'text-md',
		childTextSize = 'text-xs',
		bodyTextSize = 'text-sm',
		textColor = 'text-muted',
		childTextColor = 'text-secondary',
		surface = 'overlayed',
		empty,
		footer,
		trigger,
		class: className,
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
	class={['dialog open-column sized pop enter-scale radius-lg', surface, className]}
	aria-label="Command palette"
	{@attach dialogSync(() => open, setOpen, { dismissible: true })}
	{@attach vars({ size: 'var(--measure-md)' })}
	{...rest}
>
	<div class="row ycenter gap-sm px-lg py-bs bb-sub shrink-0">
		<Icon icon={luSearch} class={['shrink-0', textColor]} />
		<input
			bind:this={field}
			class={['bare grow', textSize]}
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
		class={['box gap-xs grow min0 scroll-y scroll-thin', 'pad-xs']}
		{@attach stagger({ selector: '[role="option"]', step: 30 })}
	>
		{#key query}
			{#each groups as group (group.group)}
				<div role="group" aria-label={group.group || undefined} class="box">
					{#if group.group}
						<div class={['weight-500 px-sm pt-sm pb-xs select-none', childTextSize, textColor]}>{group.group}</div>
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
								<Icon icon={command.icon} class={['shrink-0', childTextColor]} />
							{/if}
							<span class="grow truncate">
								{#each marks(command.label, query) as part, i (`${i}:${part.text}`)}
									{#if part.hit}<span class="weight-600 text-theme">{part.text}</span>{:else}{part.text}{/if}
								{/each}
							</span>
							{#if command.shortcut}
								<kbd class={['kbd shrink-0 font-mono', childTextSize, textColor]}>{command.shortcut}</kbd>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div class={['px-sm py-lg ta-c', bodyTextSize, textColor]}>
					{#if empty}
						{@render empty(query)}
					{:else}
						{query.trim() ? `No results for “${query.trim()}”.` : 'No commands.'}
					{/if}
				</div>
			{/each}
		{/key}
	</div>
	<footer class={['row wrap ycenter gap-sm px-lg py-sm bt-sub shrink-0', childTextSize, textColor]}>
		{#if footer}
			{@render footer()}
		{:else}
			<span class="row ycenter gap-xs"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> to navigate</span>
			<span class="row ycenter gap-xs"><kbd class="kbd">↵</kbd> to select</span>
			<span class="row ycenter gap-xs"><kbd class="kbd">esc</kbd> to close</span>
		{/if}
	</footer>
</dialog>
