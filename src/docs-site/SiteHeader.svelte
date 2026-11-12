<script lang="ts">
	import { page } from '$app/state';
	import { Icon } from '@fractaldesign/icons';
	import { luMenu, luMoon, luPalette, luSun, luX } from '@fractaldesign/icons/lucide';
	import { theme, themes } from '@fractaldesign/fractalsvelte-ui/theme';
	import { anchor, floating } from '../lib/internal/floating.js';
	import { headerLinks } from './nav.js';
	import { shell } from './shell.svelte.js';

	const uid = $props.id();
	const path = $derived(page.url.pathname);
	const hue = $derived(theme.hue ?? theme.preset.hue);
	const dark = $derived(theme.resolvedMode === 'dark');
</script>

<header class="app-header z-sticky">
	<div class="row xbetween ycenter gap-md wfull">
		<div class="row ycenter gap-lg">
			{#if shell.hasSidebar}
				<button
					type="button"
					class="ghost h-bs btn-icon mincurved lg-hide"
					aria-label={shell.open ? 'Close navigation' : 'Open navigation'}
					aria-expanded={shell.open}
					onclick={() => (shell.open = !shell.open)}
				>
					<Icon icon={shell.open ? luX : luMenu} />
				</button>
			{/if}
			<a href="/" class="logo-link row ycenter gap-sm" aria-label="fractalsvelte-ui — home">
				<span class="swatch"></span>
				<span class="text-lg weight-600 wordmark">fractalsvelte-ui</span>
			</a>
			<nav class="row ycenter gap-xs md-only" aria-label="Primary">
				{#each headerLinks as l (l.href)}
					<a href={l.href} class={['nav-link nav-link-sm', l.match(path) ? 'text-primary' : 'text-secondary']} aria-current={l.match(path) ? 'page' : undefined}>{l.label}</a>
				{/each}
			</nav>
		</div>
		<div class="row ycenter gap-xs">
			<button type="button" class="ghost h-bs btn-icon mincurved anchor" aria-label="Theme" popovertarget="{uid}-theme" {@attach anchor(`${uid}-theme`)}>
				<Icon icon={luPalette} />
			</button>
			<button type="button" class="ghost h-bs btn-icon mincurved" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onclick={(e) => theme.toggleMode(e)}>
				<Icon icon={dark ? luSun : luMoon} />
			</button>
		</div>
	</div>

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
						class={['ghost h-bs px-sm mincurved gap-xs text-xs', theme.theme === t.id && !theme.customised && 'selected']}
						onclick={() => theme.setTheme(t.id)}
					>
						<span class="swatch" data-theme={t.id}></span>
						<span>{t.label}</span>
					</button>
				{/each}
			</div>
			<label class="box gap-xs text-xs text-muted">
				<span class="row xbetween"><span>Hue</span><span class="tabular-nums">{Math.round(hue)}°</span></span>
				<input type="range" min="0" max="360" step="1" value={hue} class="wfull" oninput={(e) => theme.set({ hue: Number(e.currentTarget.value) })} />
			</label>
		</div>
	</div>
</header>
