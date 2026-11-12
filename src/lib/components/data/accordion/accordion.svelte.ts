import { createContext } from 'svelte';

/** How items are grouped visually. */
export type AccordionVariant = 'separated' | 'contained' | 'flush';

/** Whether one or many items can be open. */
export type AccordionType = 'single' | 'multiple';

/** Shared state between Accordion and AccordionItem. */
export interface AccordionContext {
	/** The accordion's unique id prefix. */
	uid: string;
	/** Single or multiple open items. */
	type: AccordionType;
	/** Visual grouping. */
	variant: AccordionVariant;
	/** The heading level used for each item's trigger. */
	headingLevel: 2 | 3 | 4 | 5 | 6;
	/** When type is single, whether the open item can be closed. */
	collapsible: boolean;
	/** The currently open value or values. */
	value: () => string | string[] | null;
	/** Open or close an item. */
	toggle: (itemValue: string) => void;
	/** Whether an item is open. */
	isOpen: (itemValue: string) => boolean;
}

export const [getAccordion, setAccordion] = createContext<AccordionContext>();

export const variantClass: Record<AccordionVariant, string> = {
	separated: 'box gap-sm',
	contained: 'box border modern overflow-hidden stack-rule bg-surface',
	flush: 'box stack-rule'
};

export const itemClass: Record<AccordionVariant, string> = {
	separated: 'border modern bg-surface overflow-hidden',
	contained: '',
	flush: ''
};
