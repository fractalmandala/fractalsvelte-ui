<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Icon } from '@fractaldesign/icons';
	import { luMenu, luMoon, luPalette, luSun, luX } from '@fractaldesign/icons/lucide';
	import { SearchInput } from '@fractaldesign/fractalsvelte-ui';
	import { theme, themes } from '@fractaldesign/fractalsvelte-ui/theme';
	import { anchor, floating, popoverSync } from '../lib/internal/floating.js';
	import { headerLinks } from './nav.js';
	import { searchComponents } from './search.js';
	import { shell } from './shell.svelte.js';

	const uid = $props.id();
	const path = $derived(page.url.pathname);
	const hue = $derived(theme.hue ?? theme.preset.hue);
	const dark = $derived(theme.resolvedMode === 'dark');

	let query = $state('');
	let dismissed = $state(false);
	let active = $state(0);
	let fieldEl: HTMLElement | undefined = $state();
	let panelEl: HTMLElement | undefined = $state();

	const results = $derived(searchComponents(query));
	const listOpen = $derived(query.trim().length >= 3 && !dismissed);

	$effect(() => {
		if (!listOpen) return;
		document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
	});

	afterNavigate(() => {
		query = '';
		dismissed = true;
		active = 0;
	});

	function closeList(): void {
		dismissed = true;
	}

	function onQueryChange(): void {
		dismissed = false;
		active = 0;
	}

	function onSearchKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && listOpen) {
			event.preventDefault();
			closeList();
			return;
		}
		if (!listOpen || results.length === 0) return;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			active = (active + 1) % results.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			active = (active - 1 + results.length) % results.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const item = results[active] ?? results[0];
			if (item) {
				closeList();
				void goto(item.href);
			}
		}
	}

	function onPointerDown(event: PointerEvent): void {
		if (!listOpen) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (fieldEl?.contains(target) || panelEl?.contains(target)) return;
		closeList();
	}

	function onPopoverChange(open: boolean): void {
		if (!open) dismissed = true;
	}
</script>

<svelte:window onpointerdown={onPointerDown} />

<header class="app-header z-sticky xbetween row ycenter">
	<a class="logo-link row ycenter gap-sm" href="/">
		<img src="/images/fractalsvelte-black.png" class="logotype" alt="logotype" />
	</a>
	<div class="row grow"></div>
	<div class="row ycenter gap-lg">
		<div
			bind:this={fieldEl}
			class="anchor grow wmin0 measure-xs"
			{@attach anchor(`${uid}-search`)}
		>
			<SearchInput
				bind:value={query}
				onValueChange={onQueryChange}
				size="sm"
				placeholder="Search components…"
				aria-label="Search components"
				role="combobox"
				aria-autocomplete="list"
				aria-expanded={listOpen}
				aria-controls="{uid}-results"
				aria-activedescendant={listOpen && results.length
					? `${uid}-opt-${active}`
					: undefined}
				onkeydown={onSearchKeydown}
			/>
		</div>
		<nav class="row ycenter gap-bs header-nav" aria-label="Primary">
			{#each headerLinks as l (l.href)}
				<a
					href={l.href}
					class={[l.match(path) ? 'text-primary' : 'text-secondary']}
					aria-current={l.match(path) ? 'page' : undefined}>{l.label}</a
				>
			{/each}
		</nav>
		<div class="row gap-sm">
			<button
				type="button"
				class="ghost h-bs btn-icon mincurved anchor shrink-0"
				aria-label="Theme"
				popovertarget="{uid}-theme"
				{@attach anchor(`${uid}-theme`)}
			>
				<Icon icon={luPalette} />
			</button>
			<button
				type="button"
				class="ghost h-bs btn-icon mincurved shrink-0"
				aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
				onclick={(e) => theme.toggleMode(e)}
			>
				<Icon icon={dark ? luSun : luMoon} />
			</button>
		</div>
	</div>

	{#if query.trim().length >= 3}
		<div
			bind:this={panelEl}
			id="{uid}-results"
			popover="manual"
			class="floating at-bottom-start pop enter-down bg-overlay border radius-bs rim shad-lg pad-xs match-anchor measure-sm max-h-xs scroll-y scroll-thin box gap-xs"
			role="listbox"
			aria-label="Components"
			{@attach floating(`${uid}-search`)}
			{@attach popoverSync(() => listOpen, onPopoverChange)}
		>
			{#if results.length}
				{#each results as item, i (item.href)}
					<a
						id="{uid}-opt-{i}"
						href={item.href}
						class={['item', i === active && 'highlighted']}
						role="option"
						aria-selected={i === active}
						onpointerenter={() => (active = i)}
					>
						<span class="box gap-xs grow wmin0">
							<span class="text-sm weight-600">{item.name}</span>
							{#if item.summary}
								<span class="text-xs text-secondary clamp-2">{item.summary}</span>
							{/if}
						</span>
					</a>
				{/each}
			{:else}
				<p class="text-sm text-muted pad-sm">No components match</p>
			{/if}
		</div>
	{/if}

	<div
		id="{uid}-theme"
		popover="auto"
		class="floating at-bottom-end pop enter-down bg-overlay border radius-bs rim shad-lg pad-bs measure-xs"
		{@attach floating(`${uid}-theme`)}
	>
		<div class="box gap-bs">
			<p class="text-xs text-muted tt-u ls-wide-lg">Theme</p>
			<div class="row wrap gap-xs" role="radiogroup" aria-label="Theme">
				{#each themes as t (t.id)}
					<button
						type="button"
						role="radio"
						aria-checked={theme.theme === t.id && !theme.customised}
						class={[
							'ghost h-bs px-sm mincurved gap-xs text-xs',
							theme.theme === t.id && !theme.customised && 'selected'
						]}
						onclick={() => theme.setTheme(t.id)}
					>
						<span class="theme-swatch" data-theme={t.id}></span>
						<span>{t.label}</span>
					</button>
				{/each}
			</div>
			<label class="box gap-xs text-xs text-muted">
				<span class="row xbetween"
					><span>Hue</span><span class="tabular-nums">{Math.round(hue)}°</span></span
				>
				<input
					type="range"
					min="0"
					max="360"
					step="1"
					value={hue}
					class="wfull"
					oninput={(e) => theme.set({ hue: Number(e.currentTarget.value) })}
				/>
			</label>
		</div>
	</div>
</header>
