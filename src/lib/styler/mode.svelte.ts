/**
 * Light / dark mode for the fractalstyler edition.
 *
 * fractalstyler defines its tokens under [data-mode="light"] and
 * [data-mode="dark"] only, so something must put that attribute on an ancestor
 * — usually <html>. This writes the attribute (never a style) and remembers the
 * choice.
 */

export type FsMode = 'light' | 'dark';

const STORAGE_KEY = 'fractalstyler-mode';

class ModeState {
	current = $state<FsMode>('light');
	#started = false;

	/** Reads the saved or preferred mode and applies it to <html>. Safe to call repeatedly. */
	init() {
		if (this.#started || typeof window === 'undefined') return;
		this.#started = true;
		let saved: string | null = null;
		try {
			saved = localStorage.getItem(STORAGE_KEY);
		} catch {
			// storage blocked: fall back to the OS preference
		}
		if (saved === 'light' || saved === 'dark') this.current = saved;
		else this.current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		this.#apply();
	}

	set(mode: FsMode) {
		this.current = mode;
		this.#apply();
	}

	toggle() {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}

	#apply() {
		if (typeof document === 'undefined') return;
		document.documentElement.dataset.mode = this.current;
		try {
			localStorage.setItem(STORAGE_KEY, this.current);
		} catch {
			// storage blocked: the attribute still applies for this page
		}
	}
}

export const modeState = new ModeState();
