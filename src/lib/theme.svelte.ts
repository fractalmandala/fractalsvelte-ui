/**
 * Reactive Theme State Manager for Fractal UI
 * Uses Svelte 5 runes for seamless theme synchronization.
 */

export type ThemeMode = 'light' | 'dark';
export type ThemeStyle = 'fractal' | 'pro' | 'beui' | 'halaska' | 'cyber';

class ThemeState {
	current = $state<ThemeMode>('dark');
	style = $state<ThemeStyle>('fractal');

	constructor() {
		if (typeof window !== 'undefined') {
			const savedMode = localStorage.getItem('fractal-ui-theme') as ThemeMode | null;
			if (savedMode === 'light' || savedMode === 'dark') {
				this.current = savedMode;
			} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
				this.current = 'light';
			}

			const savedStyle = localStorage.getItem('fractal-ui-theme-style') as ThemeStyle | null;
			if (savedStyle && ['fractal', 'pro', 'beui', 'halaska', 'cyber'].includes(savedStyle)) {
				this.style = savedStyle;
			}

			this.apply();
		}
	}

	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		this.apply();
	}

	setMode(theme: ThemeMode) {
		this.current = theme;
		this.apply();
	}

	setStyle(style: ThemeStyle) {
		this.style = style;
		this.apply();
	}

	private apply() {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', this.current);
			document.documentElement.setAttribute('data-theme-style', this.style);
			localStorage.setItem('fractal-ui-theme', this.current);
			localStorage.setItem('fractal-ui-theme-style', this.style);
		}
	}
}

export const themeState = new ThemeState();
