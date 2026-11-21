import { createContext } from 'svelte';
import type { Grouping, Pad, Surface } from '../../../internal/tokens.js';

export type AccordionType = 'single' | 'multiple';

export interface AccordionContext {
	uid: string;
	multiple: boolean;
	grouping: Grouping;
	surface: Surface;
	headingLevel: 2 | 3 | 4 | 5 | 6;
	collapsible: boolean;
	value: () => string | string[] | null;
	toggle: (itemValue: string) => void;
	isOpen: (itemValue: string) => boolean;
}

export const [getAccordion, setAccordion] = createContext<AccordionContext>();

export const rootClass: Record<Grouping, string> = {
	contained: '',
	separated: 'gap-sm',
	flush: ''
};

export const itemClass: Record<Grouping, string> = {
	contained: '',
	separated: 'border modern overflow-hidden',
	flush: ''
};
