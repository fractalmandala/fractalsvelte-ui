import { createContext } from 'svelte';
import type { Grouping, Surface } from '../../../internal/tokens.js';
import type { Orientation, Pad, Size, TextColor } from '../../../internal/tokens.js';


export type TabsActivation = 'automatic' | 'manual';

export interface TabsContext {
	uid: string;
	value: () => string | null;
	select: (value: string) => void;
	orientation: Orientation;
	grouping: Grouping;
	surface: Surface;
	activation: TabsActivation;
	size: Size;
	textColor: TextColor;
	animated: boolean;
}

export const [getTabs, setTabs] = createContext<TabsContext>();
