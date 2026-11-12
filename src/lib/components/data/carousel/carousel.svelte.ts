import { createContext } from 'svelte';

/** A registered slide. */
export interface SlideMeta {
	label?: string;
	node: HTMLElement;
}

/** Shared state between Carousel and CarouselSlide. */
export interface CarouselContext {
	/** The carousel's unique id prefix. */
	uid: string;
	/** Register a slide element; returns an unregister function. */
	register: (meta: SlideMeta) => () => void;
	/** The current slide index. */
	index: () => number;
	/** How many slides are registered. */
	total: () => number;
	/** The 0-based position of a slide node, or -1 if it has not registered yet. */
	position: (node: HTMLElement | null) => number;
}

export const [getCarousel, setCarousel] = createContext<CarouselContext>();
