import { createContext } from 'svelte';
import type { Orientation, Size } from '../../../internal/tokens.js';

/** How the tab list is drawn. */
export type TabsVariant = 'underline' | 'pill' | 'enclosed';

/** Whether arrow keys select a tab (`automatic`) or only move focus (`manual`). */
export type TabsActivation = 'automatic' | 'manual';

/** Shared state between Tabs, TabList, Tab and TabPanel. */
export interface TabsContext {
	/** The group's unique id prefix, used to pair tabs with their panels. */
	uid: string;
	/** The selected tab's value. */
	value: () => string | null;
	/** Select a tab. */
	select: (value: string) => void;
	/** List orientation. */
	orientation: Orientation;
	/** Visual style of the list and the sliding indicator. */
	variant: TabsVariant;
	/** Keyboard activation mode. */
	activation: TabsActivation;
	/** Control height and text scale. */
	size: Size;
	/** Whether panels enter and leave with a spring fade. */
	animated: boolean;
}

export const [getTabs, setTabs] = createContext<TabsContext>();
