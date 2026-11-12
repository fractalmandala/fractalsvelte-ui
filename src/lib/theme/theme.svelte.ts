import { globalMotion } from '../motion/animate.js';
import { startViewTransition } from '../motion/view-transitions.js';

/** `system` follows the OS preference. */
export type ThemeMode = 'light' | 'dark' | 'system';
/** The built-in named themes — each is three numbers in the stylesheet. */
export type ThemeName = 'fractalsvelte' | 'aurora' | 'ocean' | 'ember' | 'rose' | 'lime' | 'amber' | 'mono';
export type ThemeRadius = 'sharp' | 'soft' | 'round';
export type ThemeDensity = 'compact' | 'cozy' | 'comfortable';
export type ThemeMotion = 'off' | 'calm' | 'snappy' | 'playful';

export interface ThemePreset {
	id: ThemeName;
	label: string;
	hue: number;
	chroma: number;
	tint: number;
}

/** The named themes and the numbers behind them.
 *  Keep in sync with `@fractaldesign/fractalstyler` `src/lib/styles/colors-themes.css` — that stylesheet is the source; this list is a mirror for the picker and `theme.hue`. */
export const themes: ThemePreset[] = [
	{ id: 'fractalsvelte', label: 'Fractalsvelte', hue: 38, chroma: 0.2, tint: 0.012 },
	{ id: 'aurora', label: 'Aurora', hue: 168, chroma: 0.15, tint: 0.01 },
	{ id: 'ocean', label: 'Ocean', hue: 238, chroma: 0.17, tint: 0.014 },
	{ id: 'ember', label: 'Ember', hue: 42, chroma: 0.19, tint: 0.01 },
	{ id: 'rose', label: 'Rose', hue: 8, chroma: 0.2, tint: 0.01 },
	{ id: 'lime', label: 'Lime', hue: 128, chroma: 0.2, tint: 0.008 },
	{ id: 'amber', label: 'Amber', hue: 78, chroma: 0.17, tint: 0.01 },
	{ id: 'mono', label: 'Mono', hue: 268, chroma: 0, tint: 0 }
];

/** Everything a theme is. `hue`/`chroma`/`tint` are `null` until customised. */
export interface ThemeSettings {
	mode: ThemeMode;
	theme: ThemeName;
	hue: number | null;
	chroma: number | null;
	tint: number | null;
	radius: ThemeRadius;
	density: ThemeDensity;
	motion: ThemeMotion;
}

export const defaultTheme: ThemeSettings = {
	mode: 'system',
	theme: 'fractalsvelte',
	hue: null,
	chroma: null,
	tint: null,
	radius: 'soft',
	density: 'cozy',
	motion: 'snappy'
};

const STORAGE_KEY = 'fractalsvelte-ui-theme';

/**
 * The theme runtime: reactive settings that are written to an element
 * (default `<html>`) as `data-*` attributes and custom properties — the
 * stylesheet does the rest. Use the shared `theme` instance.
 */
export class ThemeState {
	mode = $state<ThemeMode>(defaultTheme.mode);
	theme = $state<ThemeName>(defaultTheme.theme);
	hue = $state<number | null>(null);
	chroma = $state<number | null>(null);
	tint = $state<number | null>(null);
	radius = $state<ThemeRadius>(defaultTheme.radius);
	density = $state<ThemeDensity>(defaultTheme.density);
	motion = $state<ThemeMotion>(defaultTheme.motion);
	/** What the OS asks for; updated by `initTheme`. */
	systemDark = $state(true);

	/** The mode actually in effect — `system` resolved. */
	get resolvedMode(): 'light' | 'dark' {
		return this.mode === 'system' ? (this.systemDark ? 'dark' : 'light') : this.mode;
	}

	/** The preset behind the current theme name. */
	get preset(): ThemePreset {
		return themes.find((t) => t.id === this.theme) ?? themes[0];
	}

	/** True when hue, chroma or tint override the named theme. */
	get customised(): boolean {
		return this.hue !== null || this.chroma !== null || this.tint !== null;
	}

	/** A plain snapshot — what is persisted. */
	get settings(): ThemeSettings {
		return {
			mode: this.mode,
			theme: this.theme,
			hue: this.hue,
			chroma: this.chroma,
			tint: this.tint,
			radius: this.radius,
			density: this.density,
			motion: this.motion
		};
	}

	/** Merge settings in. */
	set(settings: Partial<ThemeSettings>): void {
		Object.assign(this, settings);
	}

	/** Pick a named theme and drop any hue/chroma/tint override. */
	setTheme(name: ThemeName): void {
		this.theme = name;
		this.hue = this.chroma = this.tint = null;
	}

	/** Back to the defaults. */
	reset(): void {
		this.set(defaultTheme);
	}

	/**
	 * Switch mode. Pass the click event (or an element) to wipe the new mode in
	 * as a circle from that point, through a view transition.
	 */
	setMode(mode: ThemeMode, origin?: MouseEvent | Element): Promise<void> {
		return startViewTransition(
			() => {
				this.mode = mode;
				if (typeof document !== 'undefined') this.apply();
			},
			{ type: origin ? 'reveal' : 'fade', origin }
		);
	}

	/** Flip between light and dark. */
	toggleMode(origin?: MouseEvent | Element): Promise<void> {
		return this.setMode(this.resolvedMode === 'dark' ? 'light' : 'dark', origin);
	}

	/** Write the settings to an element. `initTheme` does this reactively. */
	apply(root: HTMLElement = document.documentElement): void {
		root.dataset.mode = this.resolvedMode;
		root.dataset.theme = this.theme;
		root.dataset.radius = this.radius;
		root.dataset.density = this.density;
		root.dataset.motion = this.motion;
		const custom: Record<string, number | null> = { '--hue': this.hue, '--chroma': this.chroma, '--tint': this.tint };
		for (const [name, value] of Object.entries(custom)) {
			if (value === null) root.style.removeProperty(name);
			else root.style.setProperty(name, String(value));
		}
		if (root === document.documentElement) globalMotion.scale = this.motion === 'off' ? 0 : 1;
	}
}

/** The shared theme. Import it anywhere; call `initTheme()` once in the root layout. */
export const theme = new ThemeState();

export interface InitThemeOptions {
	/** Starting settings, used when nothing is stored. */
	defaults?: Partial<ThemeSettings>;
	/** Persist to `localStorage` under this key. `false` disables persistence. */
	storageKey?: string | false;
}

/**
 * Start the theme runtime. Call it during the root layout's initialisation:
 * it restores stored settings, follows the OS colour scheme, and keeps
 * `<html>` and `localStorage` in step with `theme`. Safe on the server (a no-op).
 */
export function initTheme(options: InitThemeOptions = {}): void {
	const { defaults, storageKey = STORAGE_KEY } = options;
	if (defaults) theme.set(defaults);

	$effect(() => {
		if (storageKey) {
			try {
				const stored = localStorage.getItem(storageKey);
				if (stored) theme.set(JSON.parse(stored) as Partial<ThemeSettings>);
			} catch {
				// unreadable storage: keep the defaults
			}
		}
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		theme.systemDark = media.matches;
		const onChange = (event: MediaQueryListEvent) => (theme.systemDark = event.matches);
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	});

	$effect(() => {
		theme.apply();
		if (storageKey) {
			try {
				localStorage.setItem(storageKey, JSON.stringify(theme.settings));
			} catch {
				// storage full or blocked: the theme still applies
			}
		}
	});
}

/**
 * A tiny blocking script for `<svelte:head>` / `app.html` that applies the
 * stored theme before first paint, so there is no flash of the wrong mode.
 */
export function themeInitScript(storageKey: string = STORAGE_KEY): string {
	return `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||'{}'),d=document.documentElement,m=s.mode||'system';d.dataset.mode=m==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;if(s.theme)d.dataset.theme=s.theme;if(s.radius)d.dataset.radius=s.radius;if(s.density)d.dataset.density=s.density;if(s.motion)d.dataset.motion=s.motion;['hue','chroma','tint'].forEach(function(k){if(s[k]!=null)d.style.setProperty('--'+k,s[k])})}catch(e){}})()`;
}
